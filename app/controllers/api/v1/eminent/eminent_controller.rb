class Api::V1::Eminent::EminentController < BaseApiController
  before_action :authenticate_eminent
  include CustomMemberFormHelper
  include UtilHelper

  def fetch_eminent
    token = (request.env['HTTP_AUTHORIZATION'] || '').split(' ').last
    eminent_user = CustomMemberForm.find_by(token: token)
    if eminent_user.nil?
      return render json: {
        success: false,
        message: 'No eminent entry found. Please contact administrator.',
        data: nil,
        is_view: false
      }, status: :bad_request
    else
      return render json: {
        success: false,
        message: 'Success.',
        data: eminent_user,
        is_view: eminent_user.aasm_state == 'approved'
      }, status: :bad_request
    end
  end

  def update_eminent
    begin
      token = (request.env['HTTP_AUTHORIZATION'] || '').split(' ').last
      custom_member = CustomMemberForm.find_by(token: token)
      if custom_member.nil?
        return render json: {
          success: false,
          message: 'No eminent entry found. Please contact Administrator',
          data: nil,
          is_view: false
        }, status: :bad_request
      end

      # check if the base of the eminent form is valid
      is_form_params_valid = validate_form(@@schema_base, params.as_json)
      unless is_form_params_valid[:is_valid]
        return render json: {
          success: false,
          message: 'Invalid request',
          error: is_form_params_valid[:error]
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
          error: is_form_data_is_valid[:error]
        }, status: :bad_request
      end

      phone_number = params[:data][:mobiles]
      form_type = params[:form_type]
      is_draft = params[:is_draft]
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

      if custom_member.country_state_id != cs
        return render json: {
          success: false,
          message: 'Invalid country state id provided.'
        }, status: :bad_request
      end

      if form_type != CustomMemberForm::TYPE_EMINENT
        return render json: {
          success: false,
          message: 'Invalid form type provided.'
        }, status: :bad_request
      end

      # used for update of eminent_personality custom member form
      custom_member.update!(data: params[:data], device_info: params[:device_info], channel: eminent_channel)
      if is_draft && custom_member.may_mark_incomplete?
        custom_member.mark_incomplete!
      end
      if !is_draft && custom_member.may_submit?
        custom_member.submit!
      end
      if current_user.blank?
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
    rescue StandardError => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def logout
    begin
      token = (request.env['HTTP_AUTHORIZATION'] || '').split(' ').last
      eminent_user = CustomMemberForm.find_by(token: token)
      if eminent_user.nil?
        return render json: {
          success: false,
          message: 'Success'
        }, status: :ok
      else
        eminent_user.update!(otp: nil, otp_created_at: nil, token: nil)
        return render json: {
          success: false,
          message: 'Success'
        }, status: :ok
      end
    rescue StandardError => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end
end
