module ApplicationHelper
  def current_user
    User.find_by_id(session[:user_id])
  end

  def current_auth_user
    AuthUser.find_by_id(session[:user_id])
  end

  def get_client_app
    ClientApp.find_by(name: ENV['CLIENT_APP_PERMISSION']) if ENV['CLIENT_APP_PERMISSION'].present?
  end

  def fetch_user_assigned_country_states
    current_user_id = current_user.id.present? ? current_user.id : nil
    locations = ClientApp
      .select('DISTINCT country_states.id, country_states.name')
      .joins('LEFT JOIN user_permissions AS up ON client_apps.id = up.client_app_id')
      .joins('LEFT JOIN user_tag_locations AS utl ON up.user_tag_id = utl.user_tag_id')
      .joins('LEFT JOIN country_states ON utl.location_id = country_states.id')
      .where(name: ENV['CLIENT_APP_PERMISSION'])
      .where('up.deleted_at IS NULL')
      .where(utl: { location_type: 'CountryState' })
      .where(up: {user_id: current_user_id})
    locations.to_a
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
