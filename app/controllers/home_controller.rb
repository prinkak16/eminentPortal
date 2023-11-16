class HomeController < ApplicationController
  before_action :authenticate_user_permission, except: [:status, :candidate_login]
  def index
    @candidate_login_var = false
    render 'home/index'
  end

  def status
    render json: { message: 'Success.' }, status: 200
  end
  def candidate_login
    @candidate_login_var = true
    render "home/index"
  end

end
