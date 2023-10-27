class Api::V1::CustomMemberFormController < BaseApiController
  before_action :authenticate_user
  include CustomMemberFormHelper
  include UtilHelper

  def add
    begin
      # check if the base of the eminent form is valid
      is_form_params_valid = validate_form(@@schema_base, params.as_json)
      unless is_form_params_valid[:is_valid]
        return render json: {
          success: false,
          message: 'Invalid request',
          error: is_form_params_valid[:error],
          # log: is_form_params_valid[:log]
        }, status: :bad_request
      end

      # check if the data of the eminent is valid
      is_form_data_is_valid = {
        'is_valid': false,
        'error': [],
        'log': []
      }
      case params['is_draft']
      when true
        case params['form_step']
        when 1
          is_form_data_is_valid = validate_form(@@schema_first_step_progress, params['data'].as_json)
        when 2
          is_form_data_is_valid = validate_form(@@schema_second_step_progress, params['data'].as_json)
        when 3
          is_form_data_is_valid = validate_form(@@schema_third_step_progress, params['data'].as_json)
        when 4
          is_form_data_is_valid = validate_form(@@schema_fourth_step_progress, params['data'].as_json)
        when 5
          is_form_data_is_valid = validate_form(@@schema_fifth_step_progress, params['data'].as_json)
        when 6
          is_form_data_is_valid = validate_form(@@schema_sixth_step_progress, params['data'].as_json)
        end
      else
        case params['form_step']
        when 1
          is_form_data_is_valid = validate_form(@@schema_first_step, params['data'].as_json)
        when 2
          is_form_data_is_valid = validate_form(@@schema_second_step, params['data'].as_json)
        when 3
          is_form_data_is_valid = validate_form(@@schema_third_step, params['data'].as_json)
        when 4
          is_form_data_is_valid = validate_form(@@schema_fourth_step, params['data'].as_json)
        when 5
          is_form_data_is_valid = validate_form(@@schema_fifth_step, params['data'].as_json)
        when 6
          is_form_data_is_valid = validate_form(@@schema_sixth_step, params['data'].as_json)
        end
      end
      unless is_form_data_is_valid[:is_valid]
        return render json: {
          success: false,
          message: 'Invalid request',
          error: is_form_data_is_valid[:error],
          # log: is_form_data_is_valid[:log]
        }, status: :bad_request
      end

      custom_member = params[:data][:id].present? ? CustomMemberForm.find_by_id(params[:data][:id]) : nil
      phone_number = params[:data][:mobiles]
      form_type = params[:form_type]
      is_draft = params[:is_draft]
      existing_custom_users_found = false
      eminent_channel = params[:channel].present? ? params[:channel] : nil

      # check if the country state id valid used only for creation of eminent_personality type custom member form
      cs = params[:state_id].present? ? params[:state_id] : nil
      country_state = CountryState.where(id: cs).exists?
      unless country_state
        return render json: {
          success: false,
          message: 'Invalid country state id provided.'
        }, status: :bad_request
      end

      if form_type === CustomMemberForm::TYPE_EMINENT
        if !existing_custom_users_found && phone_number.present?
          existing_custom_users_found = custom_member_exists?(phone_number, form_type, custom_member&.id)
        end
      end

      if existing_custom_users_found
        return render json: {
          success: false,
          message: 'Phone number already exist.'
        }, status: :bad_request
      end

      if custom_member.blank?
        custom_member = CustomMemberForm.create!(
          data: params[:data],
          form_type: params[:form_type],
          country_state_id: cs,
          created_by: current_auth_user,
          device_info: params[:device_info],
          version: CustomMemberForm.latest_eminent_version,
          phone: phone_number[0],
          channel: eminent_channel
        )

        # update the user id
        params[:data][:id] = custom_member.id.to_i
        custom_member.update!(data: params[:data])

        # check if is in draft state
        if is_draft && custom_member.may_mark_incomplete?
          custom_member.mark_incomplete!
        end
        # check if form is submitted
        if !is_draft && custom_member.may_submit?
          custom_member.submit!
        end
        if is_draft
          render json: {
            success: true, data: custom_member, message: 'Member.'
          }, status: :ok
        else
          render json: {
            success: true, message: 'Member Saved successfully'
          }, status: :ok
        end
      else
        if custom_member.country_state_id != cs
          return render json: {
            success: false,
            message: 'State id can not be changed.'
          }, status: :bad_request
        end

        # used for update of eminent_personality custom member form
        custom_member.update!(data: params[:data], device_info: params[:device_info], channel: eminent_channel, office_updated_at: DateTime.now)
        if is_draft && custom_member.may_mark_incomplete?
          custom_member.mark_incomplete!
        end
        if !is_draft && custom_member.may_submit?
          custom_member.submit!
        end
        if current_user.blank? || custom_member.aasm_state == 'incomplete'
          if custom_member.aasm_state == 'incomplete'
            render json: {
              success: true,
              message: 'Thank you for your response. We will let you know the status of the form soon.'
            }, status: :ok
          else
            render json: {
              success: true,
              message: 'Member Updated successfully'
            }, status: :ok
          end
        else
          render json: {
            success: true,
            message: 'Member Updated successfully'
          }, status: :ok
        end
      end
    rescue StandardError => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def add_file
    require 'digest/md5'
    unless params[:file].present?
      render json: { success: false, message: 'Please provide a image file.' }, status: :bad_request
    end

    uploaded_file = params[:file]
    # Access the original filename
    file_name = uploaded_file.original_filename.present? ? uploaded_file.original_filename : nil
    file_extension = ".#{file_name.delete(' ').partition('.').last}"
    custom_file_name = Digest::MD5.hexdigest(file_name + SecureRandom.uuid.last(10).to_s) + file_extension
    url = upload_file_on_gcloud(uploaded_file, custom_file_name)
    render json: { success: true, message: 'Success', file_path: url }, status: :ok
  end

  def send_otp
    if params[:phone].blank? || !params[:phone].match?('^[1-9][0-9]{9}$')
      return render json: { success: false, message: 'Please provide a valid phone number.' }, status: :bad_request
    end

    if params[:form_type].blank?
      return render json: { success: false, message: 'You are not authorized to access this form.' }, status: :unauthorized
    end

    custom_member_form = fetch_member(params[:phone], params[:form_type])
    if custom_member_form.nil?
      return render json: { success: false, message: 'No record found with this phone number.' }, status: :unauthorized
    end

    custom_member_form.generate_otp
    send_sms("Your OTP is #{custom_member_form.otp} - BJP SARAL", params[:phone])
    render json: { success: true, message: 'Otp Sent successfully.' }, status: :ok
  end

  def validate_otp
    if params[:phone].blank? || !params[:phone].match?('^[1-9][0-9]{9}$')
      return render json: { success: false, message: 'Phone number can\'t be empty' }, status: :bad_request
    end

    if params[:form_type].blank?
      return render json: { success: false, message: 'You are not authorized to access this form.' }, status: :unauthorized
    end

    if params[:otp].blank?
      return render json: { success: false, message: 'Phone number can\'t be empty' }, status: :bad_request
    end

    custom_member_form = fetch_member(params[:phone], params[:form_type])

    if custom_member_form.nil?
      return render json: { success: false, message: 'No record found with this phone number.' }, status: :unauthorized
    else
      unless custom_member_form.check_otp_validation(params[:otp])
        return render json: { success: false, message: 'OTP verification failed. Please try again.' }, status: :bad_request
      end

      require 'bcrypt'
      encrypted_key = BCrypt::Password.create("#{params[:phone]}-#{params[:otp]}")
      custom_member_form.token = encrypted_key

      if custom_member_form.save
        return render json: { success: true, auth_token: encrypted_key, id: custom_member_form.id, name: custom_member_form.data['name'] || '', is_view: custom_member_form.aasm_state == 'approved' }, status: :ok
      else
        return render json: { success: false, message: 'OTP verification failed. Please try again.' }, status: :bad_request
      end
    end
  end

  def select_member
    begin
      custom_member = params[:id].present? ? CustomMemberForm.find_by_id(params[:id].to_i) : nil
      if custom_member.nil?
        return render json: { success: false, message: 'Please provide a valid member id' }, status: :bad_request
      end

      custom_member.is_selected = true
      custom_member.selection_reason = params[:reason].present? ? params[:reason] : nil
      custom_member.selected_by_id = current_auth_user.id
      custom_member.save!
      return render json: { success: true, message: 'Success' }, status: :ok
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def update_aasm_state
    begin
      custom_member = params[:id].present? ? CustomMemberForm.find_by_id(params[:id].to_i) : nil
      if custom_member.nil?
        return render json: { success: true, message: 'Please provide a valid member id' }, status: :bad_request
      end

      unless ['approve', 'reject'].include? params[:aasm_state]
        return render json: { success: true, message: 'Please provide a valid aasm state.' }, status: :bad_request
      end

      if params[:aasm_state] == 'approve'
        if custom_member.may_approve?
          custom_member.approve!
          custom_member.update(approved_by_id: current_auth_user.id)
        else
          return render json: { success: false, message: 'Transaction not allowed.' }, status: :bad_request
        end
      elsif params[:aasm_state] == 'reject'
        if custom_member.may_reject?
          custom_member.reject!
          custom_member.update(
            rejection_reason: params[:reason].present? ? params[:reason] : nil,
            rejected_by_id: current_auth_user.id
          )
        else
          return render json: { success: false, message: 'Transaction not allowed.' }, status: :bad_request
        end
      end
      return render json: { success: true, message: 'Success' }, status: :ok
    rescue StandardError => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def delete_member
    begin
      custom_member = params[:id].present? ? CustomMemberForm.find_by_id(params[:id].to_i) : nil
      if custom_member.nil?
        return render json: { success: false, message: 'Please provide a valid member id' }, status: :bad_request
      end

      if custom_member.destroy
        custom_member.deletion_reason = params[:reason].present? ? params[:reason] : nil
        custom_member.deleted_by_id = current_auth_user.id
        custom_member.save!
      else
        return render json: { success: false, message: 'Record deletion failed! Please try later!' }, status: :bad_request
      end
      render json: { success: true, message: 'Success' }, status: :ok
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def list
    # compute limit and offset
    limit = params[:limit].present? ? params[:limit] : 10
    offset = params[:offset].present? ? params[:offset] : 0
    is_download = params[:offset].present? ? params[:offset] : false

    # compute search by eminent id
    custom_members = CustomMemberForm
    eminent_ids = params[:search_by_id].present? ? params[:search_by_id].split(',') : nil
    unless eminent_ids.nil?
      eminent_ids = eminent_ids.map(&:to_i)
      custom_members = custom_members.where(id: eminent_ids)
    end

    # check form type
    type = params[:type]
    unless params[:type].present? && params[:type] === CustomMemberForm::TYPE_EMINENT
      return render json: { success: false, message: 'Please provide a valid form.' }, status: :bad_request
    end

    # compute state id
    state_ids = params[:entry_type].present? ? params[:entry_type].split(',') : nil
    if state_ids.nil?
      state_ids = []
      fetch_user_assigned_country_states.each do |country_state|
        state_ids << country_state['id']
      end
    end
    custom_members = custom_members.where(form_type: type, country_state_id: state_ids)

    # compute channel filter
    channel = params[:channel].present? ? params[:channel].split(',') : nil
    unless channel.nil?
      custom_members = custom_members.where(channel: channel)
    end

    # compute age group filter
    age_groups = params[:age_group].present? ? params[:age_group].split(',') : nil
    unless age_groups.nil?
      age_group_query = custom_member_age_group_query(age_groups)
      custom_members = custom_members.where(age_group_query)
    end

    # compute channel filter
    form_status = params[:form_status].present? ? params[:form_status].split(',') : nil
    unless form_status.nil?
      custom_members = custom_members.where(aasm_state: form_status)
    end

    # compute education filter
    educations = params[:education].present? ? params[:education].split(',') : nil
    unless educations.nil?
      custom_members = custom_members.where("data->'education_level' ?| array[:education_values]", education_values: educations)
    end

    # compute gender filter
    genders = params[:gender].present? ? params[:gender].split(',') : nil
    unless genders.nil?
      custom_members = custom_members.where("data->'gender' ?| array[:gender_values]", gender_values: genders)
    end

    # compute profession filter
    professions = params[:profession].present? ? params[:profession].split(',') : nil
    unless professions.nil?
      custom_members = custom_members.where("data->'profession' ?| array[:profession_values]", profession_values: professions)
    end

    # compute profession filter
    category = params[:category].present? ? params[:category].split(',') : nil
    unless category.nil?
      custom_members = custom_members.where("data->'category' ?| array[:category_values]", category_values: category)
    end

    # compute search
    query_search = params[:query].present? ? params[:query].split(',') : nil
    unless query_search.nil?
      search_query = []
      phone_numbers_query = query_search.select { |number| number.match?(/^\d+$/) }
      names_query = query_search.reject { |number| number.match?(/^\d{10}$/) }

      if names_query.size.positive?
        modified_names_query = names_query.map { |element| "LOWER(data->>'name') LIKE '%#{element.downcase}%'" }
        search_query += modified_names_query
      end

      if phone_numbers_query.size.positive?
        modified_names_query = phone_numbers_query.map { |element| "data->>'mobiles' LIKE '%#{element}%'" }
        search_query += modified_names_query
      end
      custom_members = custom_members.where(search_query.join(' OR '))
    end
    length = custom_members.length
    custom_members = custom_members.order('created_at desc')

    if !custom_members.blank?
      if is_download == true
        render json: {
          success: true,
          message: 'Success.',
          data: {
            'members': custom_members,
            'length': length
          }
        }, status: :ok
      else
        res_data = custom_members.includes(:country_state).limit(limit).offset(offset).as_json(include: [:country_state])
        res_data[0]['attached'] = 'https://www.africau.edu/images/default/sample.pdf'
        render json: {
          success: true,
          message: 'Success.',
          data: {
            'members': res_data,
            'length': length
          }
        }, status: :ok
      end
    else
      render json: { success: false, message: 'No member found.' }, status: :not_found
    end
  end

  def destroy_session
    user_sign_out
    render json: {
      success: true,
      message: 'Success.'
    }, status: :ok
  end
end
