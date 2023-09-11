class AuthController < ApplicationController
  protect_from_forgery with: :null_session
  include ApplicationHelper
  include AuthHelper

  def callback
    user = handle_params(params: params)
    user_sign_in(user)
    if current_user.present? && current_user.has_app_access?
      redirect_to root_url, allow_other_host: true
    else
      redirect_to ENV['SIGN_IN_URL'], allow_other_host: true
    end
  end
end
