class AuthController < ApplicationController
  protect_from_forgery with: :null_session
  include ApplicationHelper

  def callback
    unless current_user.present? && current_user.has_app_access?
      session[:user_id] = nil
      redirect_to ENV['SIGN_IN_URL'], allow_other_host: true
    end
  end
end
