class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session
  include ApplicationHelper
  include AuthHelper

  def authenticate_user_permission
    unless current_user.present? && current_user.has_app_access?
      session[:user_id] = nil
      redirect_to ENV['SIGN_IN_URL'], allow_other_host: true
    end
  end

  def authenticate_user
    token = (request.env["HTTP_AUTHORIZATION"] || "").split(" ").last
    if token&.present?
      user = handle_api_auth(api_token: token)
      if user.present?
        session[:user_id] = user
      else
        render json: {
          status: :redirect,
          link: ENV['SIGN_IN_URL']
        }
      end
    else
      if session[:user_id].present?
        current_user
      else
        render json: {
          status: :redirect,
          link: ENV['SIGN_IN_URL']
        }
      end
    end
  end

end
