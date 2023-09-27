class Api::V1::CustomMemberFormController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user

  def custom_member_exists?(phone_number, form_type, cm_id)
    CustomMemberForm.where.not(id: cm_id).where(phone: phone_number, form_type: form_type).exists?
  end
  def add
    begin
      unless params[:data].present?
        render json: { success: false, message: 'Invalid request' }, status: :bad_request
      end
      custom_member = params[:data][:id].present? ? CustomMemberForm.find_by_id(params[:data][:id]) : nil
      phone_number = params[:data][:mobiles]
      form_type = params[:form_type]
      is_draft = params[:is_draft]
      existing_custom_users_found = false
      if form_type === CustomMemberForm::TYPE_EMINENT
        unless existing_custom_users_found && phone_number.present?
          existing_custom_users_found = custom_member_exists?(phone_number, form_type, custom_member&.id)
        end
      end
      if existing_custom_users_found
        raise StandardError, "Phone number already exist"
      end

      if custom_member.blank?
        # used only for creation of eminent_personality type custom member form
        cs = params[:state_id].present? ? params[:state_id] : nil
        custom_member = CustomMemberForm.create!(
          data: params[:data],
          form_type: params[:form_type],
          country_state_id: cs,
          created_by: current_auth_user,
          device_info: params[:device_info],
          version: CustomMemberForm.latest_eminent_version,
          phone: phone_number
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
            success: true, data: custom_member, message: 'Member.' }, status: :ok
        else
          render json: { success: true, message: 'Member Saved successfully' }, status: :ok
        end
      else
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

end