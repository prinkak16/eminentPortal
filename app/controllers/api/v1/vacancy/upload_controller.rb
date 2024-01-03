class Api::V1::Vacancy::UploadController < BaseApiController
  before_action :authenticate_user
  include CustomMemberFormHelper
  include UtilHelper
  include MetadataHelper
  include MailHelper

  def manual_upload
    begin
      unless is_permissible?('MasterOfVacancies', 'Upload')
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :bad_request
      end

      p_regex = phone_regex
      upload_result = []

      # check if email not exist
      email = params[:email].present? ? params[:email] : nil
      if email.nil?
        return render json: {
          success: false,
          message: 'Please provide a valid email for notification.'
        }, status: :bad_request
      end

      # check if file not exist
      file = params[:file].present? ? params[:file] : nil
      if file.nil? || file.content_type != 'text/csv'
        return render json: {
          success: false,
          message: 'Please provide a valid csv file.'
        }, status: :bad_request
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

      # check if file is valid or not
      unless rows.length.positive?
        return render json: {
          success: false,
          message: 'Please provide a valid csv file.'
        }, status: :bad_request
      end

      rows.each do |row|
        row_data = {
          action: row[0],
          vacancy_id: row[1],
          ministry_name: row[2],
          department_name: row[3],
          organization_name: row[4],
          is_listed: row[5],
          psu_type: row[6],
          designation: row[7],
          error: '',
          success: false
        }

        unless row_data[:action].present?
          row_data[:error] = 'Please provide a valid action(ADD, EDIT, DELETE).'
          upload_result << row_data
          next
        end

        unless %w[ADD EDIT DELETE].include? row_data[:action]
          row_data[:error] = 'Please provide a valid action(ADD, EDIT, DELETE).'
          upload_result << row_data
          next
        end

        # compute ministry
        ministry_id_v = nil
        if !row_data[:ministry_name].present?
          row_data[:error] = 'Please provide ministry name.'
          upload_result << row_data
          next
        else
          ministry_slug = convert_to_snake_case(row_data[:ministry_name])
          ministry_details = Ministry.where(name: row_data[:ministry_name], slug: ministry_slug).first_or_create!
          ministry_id_v = ministry_details[:id].present? ? ministry_details[:id] : nil
        end

        # compute departments
        department_id_v = nil
        if row_data[:department_name].present?
          department_slug = convert_to_snake_case(row_data[:department_name])
          department_details = Department.where(
            ministry_id: ministry_id_v,
            name: row_data[:department_name],
            slug: department_slug
          ).first_or_create!
          department_id_v = department_details[:id].present? ? department_details[:id] : nil
        end

        # compute organization
        organization_id_v = nil
        if !row_data[:organization_name].present?
          row_data[:error] = 'Please provide organization name.'
          upload_result << row_data
          next
        else
          organization_slug = convert_to_snake_case(row_data[:organization_name])
          organization_details = Organization.where(
            ministry_id: ministry_id_v,
            name: row_data[:organization_name],
            slug: organization_slug
          ).first_or_create!
          organization_details.update(department_id: department_id_v)
          organization_details.update(is_listed: row_data[:is_listed] == 'YES')
          organization_details.update(ratna_type: row_data[:psu_type])
          organization_id_v = organization_details[:id].present? ? organization_details[:id] : nil
        end


        if row_data[:vacancy_id].present?
          # case when vacancy id is provided then only EDIT and DELETE functionality is supported
          unless %w[EDIT DELETE].include? row_data[:action]
            row_data[:error] = 'Please provide a valid action(EDIT, DELETE) in case of Vacancy Id is provided.'
            upload_result << row_data
            next
          end

          vacancy_id = row_data[:vacancy_id].to_i
          if vacancy_id.zero?
            row_data[:error] = 'Please provide a valid vacancy id.'
            upload_result << row_data
            next
          else
            vacancy_details = Vacancy.find_by_id(vacancy_id)
            if vacancy_details.nil?
              row_data[:error] = 'Vacancy id is not associated with the system.'
              upload_result << row_data
              next
            end

            if row_data[:action] == 'EDIT'
              # case EDIT
              vacancy_details.update(
                ministry_id: ministry_id_v,
                department_id: department_id_v,
                organization_id: organization_id_v,
                designation: row_data[:designation]
              )
              row_data[:success] = true
              upload_result << row_data
              next
            elsif row_data[:action] == 'DELETE'
              # case DELETE
              vacancy_details.destroy
              row_data[:success] = true
              upload_result << row_data
              next
            end
          end

        else
          # case when vacancy id is not provided then only ADD functionality is supported
          unless ['ADD'].include? row_data[:action]
            row_data[:error] = 'Please provide a valid action(ADD) in case of Vacancy Id is not provided.'
            upload_result << row_data
            next
          end

          # ADD new vacancy
          vacancy = Vacancy.new(
            ministry_id: ministry_id_v,
            department_id: department_id_v,
            organization_id: organization_id_v,
            designation: row_data[:designation]
          )
          vacancy.save

          row_data[:success] = true
          upload_result << row_data
          next
        end
      end

      csv_string = CSV.generate do |csv|
        csv << [
          'Action(ADD, EDIT, DELETE)',
          'Vacancy Id',
          'Ministry Name',
          'Department Name',
          'Organization Name',
          'Organization Type',
          'Is Listed(YES/NO)',
          'Designation',
          'Error',
          'Success'
        ]
        upload_result.each do |csv_row_data|
          csv << [
            csv_row_data[:action],
            csv_row_data[:vacancy_id],
            csv_row_data[:ministry_name],
            csv_row_data[:department_name],
            csv_row_data[:organization_name],
            csv_row_data[:psu_type],
            csv_row_data[:is_listed],
            csv_row_data[:designation],
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

      send_email(
        'Result of manual upload of Vacancies.',
        '<div>Hi,<br><div><br>Please find the attachments.<br></div></div>',
        email,
        attachments = attachments
      )

      return render json: {
        success: true,
        message: 'Success. Please check you provided email address for update.'
      }, status: :ok
    rescue StandardError => e
      return render json: {
        success: false,
        message: e.message
      }, status: :bad_request
    end
  end

end