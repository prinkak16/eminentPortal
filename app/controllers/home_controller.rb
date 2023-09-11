class HomeController < ApplicationController
  before_action :authenticate_user_permission, except: :status
  def index
    render json: { message: 'Success' }, status: 200
  end

  def status
    render json: { message: 'Success.' }, status: 200
    return
  end

end
