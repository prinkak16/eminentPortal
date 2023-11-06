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
    unless current_user.present?
      token = (request.env['HTTP_AUTHORIZATION'] || '').split(' ').last
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

  def authenticate_user_rails
    unless current_user.present?
      token = (request.env['HTTP_AUTHORIZATION'] || '').split(' ').last
      if token&.present?
        user = handle_api_auth(api_token: token)
        if user.present?
          session[:user_id] = user
        else
          redirect_to ENV['SIGN_IN_URL'], allow_other_host: true
        end
      else
        if session[:user_id].present?
          current_user
        else
          redirect_to ENV['SIGN_IN_URL'], allow_other_host: true
        end
      end
    end
  end

  def upload_file_on_gcloud(file, filename)
    require 'google/cloud/storage'
    storage = Google::Cloud::Storage.new(project_id: ENV['G_CLOUD_PROJECT_ID'], credentials: ENV['G_CLOUD_KEYFILE'])
    bucket = storage.bucket ENV['G_CLOUD_BUCKET_PUBLIC_DOCUMENTS']
    @file_urls = []
    upload_file = bucket.create_file file.tempfile,
                                     "eminent/#{filename}",
                                     content_type: file.content_type,
                                     acl: 'public'
    upload_file.public_url
  end

end
