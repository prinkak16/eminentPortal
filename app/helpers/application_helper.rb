module ApplicationHelper
  def current_user
    User.find_by_id(session[:user_id])
  end

  def current_auth_user
    AuthUser.find_by_id(session[:user_id])
  end

  def user_signed_in?
    session[:user_id].present?
  end

  def user_sign_in(user)
    session[:user_id] = user
  end

  def user_sign_out
    session[:user_id] = nil
  end
end
