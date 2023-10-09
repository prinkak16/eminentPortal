class Api::V1::CustomMemberFormController < ApplicationController
  before_action :authenticate_user
  include CustomMemberFormHelper

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
        unless existing_custom_users_found && phone_number.present?
          existing_custom_users_found = custom_member_exists?(phone_number, form_type, custom_member&.id)
        end
      end

      if custom_member.blank?
        raise StandardError, 'Phone number already exist' if existing_custom_users_found

        custom_member = CustomMemberForm.create!(
          data: params[:data],
          form_type: params[:form_type],
          country_state_id: cs,
          created_by: current_auth_user,
          device_info: params[:device_info],
          version: CustomMemberForm.latest_eminent_version,
          phone: phone_number[0]
        )
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
        raise StandardError, 'State id can not be changed.' if custom_member.country_state_id != cs

        # used for updation of eminent_personality custom member form
        custom_member.update!(data: params[:data], device_info: params[:device_info])
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
    if params[:phone].blank?
      render json: { success: false, message: 'Phone number can\'t be empty' }, status: :bad_request
    end

    if params[:form_type].blank?
      render json: { success: false, message: 'You are not authorized to access this form.' }, status: :unauthorized
    end

    custom_member_form = fetch_member(params[:phone], params[:form_type])
    if custom_member_form.nil?
      render json: { success: false, message: 'No record found with this phone number.' }, status: :unauthorized
    end

    custom_member_form.generate_otp

    send_sms("Your OTP is #{custom_member_form.otp} - BJP SARAL", params[:phone])
    render json: { success: true, message: 'Otp Sent successfully.' }, status: :ok
  end

  def validate_otp
    if params[:phone].blank?
      render json: { success: false, message: 'Phone number can\'t be empty' }, status: :bad_request
      return
    end

    if params[:form_type].blank?
      render json: { success: false, message: 'You are not authorized to access this form.' }, status: :unauthorized
      return
    end

    if params[:otp].blank?
      render json: { success: false, message: 'Phone number can\'t be empty' }, status: :bad_request
      return
    end

    custom_member_form = fetch_member(params[:phone], params[:form_type])

    if custom_member_form.nil?
      render json: { success: false, message: 'No record found with this phone number.' }, status: :unauthorized
      nil
    else
      unless custom_member_form.check_otp_validation(params[:otp])
        render json: { success: false, message: 'OTP verification failed. Please try again.' }, status: :bad_request
        return
      end

      require 'bcrypt'
      encrypted_key = BCrypt::Password.create("#{params[:phone]}-#{params[:otp]}")
      custom_member_form.token = encrypted_key

      custom_member_form.verify! if custom_member_form.may_verify?

      if custom_member_form.save
        render json: { success: true, auth_token: encrypted_key, id: custom_member_form.id, name: custom_member_form.data['name'] || '', is_view: custom_member_form.aasm_state == 'approved' }, status: :ok
        nil
      else
        render json: { success: false, message: 'OTP verification failed. Please try again.' }, status: :bad_request
        nil
      end
    end
  end
end
