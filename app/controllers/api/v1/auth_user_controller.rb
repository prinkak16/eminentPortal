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

  def logout
    user_sign_out
    render json: {
      success: true,
      message: 'Success.'
    }, status: :ok
  end
end