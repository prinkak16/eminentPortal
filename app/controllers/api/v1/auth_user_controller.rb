class Api::V1::AuthUserController < BaseApiController
  before_action :authenticate_user
  include CustomMemberFormHelper
  include UtilHelper
  include MetadataHelper

  def fetch_details
    data = {
      email: nil,
      name: nil,
      phone_number: nil
    }
    if current_user.present?
      data[:email] = current_user[:email]
      data[:name] = current_user[:name]
      data[:phone_number] = current_user[:phone_number]
    end
    render json: {
      success: true,
      message: 'Success.',
      data: data
    }, status: :ok
  end

  def user_profile
    data = {
      name: nil,
      email: nil,
      phone: nil,
      role: nil,
      permissions: nil,
      allotted_states: nil
    }

    if current_user.present?
      data[:name] = current_user[:name]
      data[:email] = current_user[:email]
      data[:phone] = current_user[:phone_number]
      data[:role] = 'Manager'
      data[:permissions] = user_permissions
      data[:allotted_states] = fetch_user_assigned_country_states

      render json: {
        success: true,
        message: 'Data received successfully.',
        data: data
      }, status: :ok
    else
      raise 'User is logged out.'
    end
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: :bad_request
  end

  def logout
    user_sign_out
    render json: {
      success: true,
      message: 'Success.'
    }, status: :ok
  end
end