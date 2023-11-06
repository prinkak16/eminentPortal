class Admin::AdminController < ApplicationController
  before_action :authenticate_user_rails
  require 'csv'
  include CustomMemberFormHelper
  include MailHelper

  def manual_upload
    permission_exist = is_permissible('EminentAdmin', 'Whitelisting')
    if permission_exist.nil?
      return render 'home/unauthorized'
    else
      return render 'admin/manual_upload'
    end
  end
  def manual_upload_data
    begin
      permission_exist = is_permissible('EminentAdmin', 'Whitelisting')
      if permission_exist.nil?
        redirect_to admin_manual_upload_path, allow_other_host: true
        return
      end

      phone_regex = '^[1-9][0-9]{9}$'
      eminent_users = []
      failed_eminent_users = []
      county_state_id = nil

      # check if file not exist
      file = params[:file].present? ? params[:file] : nil
      if file.nil? || file.content_type != 'text/csv'
        flash[:error] = 'Please provide a valid csv file.'
        redirect_to admin_manual_upload_path, allow_other_host: true
        return
      end

      # check if email not exist
      email = params[:email].present? ? params[:email] : nil
      if email.nil?
        flash[:error] = 'Please provide a valid email for notification.'
        redirect_to admin_manual_upload_path, allow_other_host: true
        return
      end

      begin
        puts 'trying with UTF-8'
        file = open(file.path)
        file.set_encoding(Encoding.find('UTF-8'))
        rows = CSV.parse(file.read, header_converters: lambda { |name| name.gsub(/\ufeff/, '') }, headers: true, :quote_char => '"')
      rescue StandardError => e
        puts 'trying with ISO'
        file = open(file.path)
        file.set_encoding(Encoding.find('ISO-8859-1'))
        rows = CSV.parse(file.read, header_converters: lambda { |name| name.gsub(/\ufeff/, '') }, headers: true, :quote_char => '"')
      end

      # check if file not exist
      unless rows.length.positive?
        flash[:error] = 'Please provide a valid csv file.'
        redirect_to admin_manual_upload_path, allow_other_host: true
        return
      end

      rows.each do |row|
        form_type = row[0]
        person_id_detail = row[1]&.strip
        country_state = CountryState.find_by_name(row[2]&.strip)
        county_state_id = country_state&.id
        person_name = row[3]&.strip
        phone_number = row[4]&.strip
        version = CustomMemberForm.latest_eminent_version
        ref_name = row[5]&.strip
        ref_phone = row[6]&.strip
        ref_bjp_id = row[7]&.strip
        ref_grade = row[8]&.strip
        ref_comments = row[9]&.strip

        row_data = {
          p_id: person_id_detail,
          cs_id: row[2]&.strip,
          data: {
            name: person_name,
            mobiles: [phone_number],
            reference: {
              name: '',
              mobile: '',
              bjp_id: '',
              grade: '',
              comments: ''
            }
          },
          error: '',
          success: false
        }

        # adding reference to the data object in case of eminent
        if form_type == CustomMemberForm::TYPE_EMINENT
          version = CustomMemberForm.latest_eminent_version
          row_data[:data][:reference][:name] = ref_name if ref_name.present?
          row_data[:data][:reference][:bjp_id] = ref_bjp_id if ref_bjp_id.present?
          row_data[:data][:reference][:grade] = ref_grade if ref_grade.present?
          row_data[:data][:reference][:comments] = ref_comments if ref_comments.present?

          if ref_phone.present?
            if ref_phone.match?(phone_regex)
              row_data[:data][:reference][:mobile] = ref_phone
            else
              row_data[:error] = 'Invalid reference phone number.'
              failed_eminent_users << row_data
              next
            end
          end
        end

        unless CustomMemberForm.allowed_form_types.include?(form_type)
          row_data[:error] = 'Invalid form type.'
          failed_eminent_users << row_data
          next
        end

        if county_state_id.nil?
          row_data[:error] = 'Invalid country state.'
          failed_eminent_users << row_data
          next
        end

        if person_name.blank?
          row_data[:error] = 'Invalid person name.'
          failed_eminent_users << row_data
          next
        end

        if !phone_number.present? || !phone_number.match?(phone_regex)
          row_data[:error] = 'Invalid phone number.'
          failed_eminent_users << row_data
          next
        end

        # check if the person id is provided
        if person_id_detail.present?
          p_id = CustomMemberForm.find_by_id(person_id_detail)
          if p_id.present?
            updated_val = p_id.data
            updated_val['mobiles'][0] = phone_number
            check_phone_exists = custom_member_exists?(updated_val['mobiles'], form_type, person_id_detail)
            if check_phone_exists
              row_data[:error] = 'Eminent phone number already exists.'
              failed_eminent_users << row_data
              next
            else
              p_id.update!(data: updated_val, phone: phone_number)
              row_data[:success] = true
              failed_eminent_users << row_data
            end
          else
            row_data[:error] = 'Invalid Person Id'
            failed_eminent_users << row_data
            next
          end
        else
          custom_member_form = CustomMemberForm.where(phone: phone_number, form_type: form_type)
            .or(CustomMemberForm.where("data -> 'mobiles' ? :query", query: phone_number).where(form_type: form_type))
          custom_member_form = custom_member_form.first
          if person_id_detail.blank?
            if custom_member_form.blank?
              custom_member_form = CustomMemberForm.create!(
                phone: phone_number,
                data: row_data[:data],
                form_type: form_type,
                country_state_id: county_state_id,
                version: version,
                created_by_id: current_auth_user.present? ? current_auth_user.id.to_i : nil,
                channel: 'Office',
                office_updated_at: DateTime.now
              )
              row_data[:data][:id] = custom_member_form.id.to_i
              update_member_id = custom_member_form.update!(data: row_data[:data])
              row_data[:success] = true
              failed_eminent_users << row_data
            elsif custom_member_form.country_state_id.present? && custom_member_form.country_state_id.to_i != county_state_id.to_i
              row_data[:error] = "Your form already exists for #{custom_member_form.country_state&.name}."
              failed_eminent_users << row_data
              next
            else
              if %w[pending otp_verified].include?(custom_member_form.aasm_state)
                custom_member_form.update(data: row_data[:data])
                custom_member_form.update(phone: phone_number)
              end
              row_data[:error] = 'Member already exists in system.'
              failed_eminent_users << row_data
              next
            end
          end
        end
      end

      csv_string = CSV.generate do |csv|
        csv << [
          'Person Id',
          'State',
          'Name',
          'Phone number',
          'Reference name',
          'Reference mobile',
          'Reference bjp id',
          'Reference grade',
          'Reference comments',
          'Error',
          'Success'
        ]
        failed_eminent_users.each do |csv_row_data|
          csv << [
            csv_row_data[:p_id],
            csv_row_data[:cs_id],
            csv_row_data[:data][:name],
            csv_row_data[:data][:mobiles].first,
            csv_row_data[:data][:reference][:name],
            csv_row_data[:data][:reference][:mobile],
            csv_row_data[:data][:reference][:bjp_id],
            csv_row_data[:data][:reference][:grade],
            csv_row_data[:data][:reference][:comments],
            csv_row_data[:error],
            csv_row_data[:success]
          ]
        end
      end

      attachments = []
      attachment = {}
      attachment[:content] = csv_string
      attachment[:filename] = "#{SecureRandom.uuid}.csv"
      attachments << attachment

      sa = send_email('Result if manual upload of eminents', '<div><br>Please find the attachments.<br></div>', email, attachments = attachments)

      flash[:success] = 'Success. Please check you provided email address for update.'
      redirect_to admin_manual_upload_path, allow_other_host: true
      return
    rescue StandardError => e
      flash[:error] = e.message
      redirect_to admin_manual_upload_path, allow_other_host: true
      return
    end
  end
end