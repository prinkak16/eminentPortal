class HomeController < ApplicationController
  before_action :authenticate_user_permission, except: :status
  def index
  end

  def status
    render json: { message: 'Success.' }, status: 200
  end

end
