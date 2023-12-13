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
  def fetch_minister_assigned_country_states
    current_user_id = nil
    if current_user.id.present?
      current_user_id = current_auth_user.assist_to_id.present? ? current_auth_user.assist_to_id : current_user.id
    end
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

  def phone_regex
    '^[1-9][0-9]{9}$'
  end

  def user_permissions
    permissions = []
    sql = "
      SELECT
        ca.NAME,
        ap.PERMISSION_NAME,
        ap.ACTION,
        ap.DISPLAY_NAME,
        ap.GROUP
      FROM public.client_apps AS ca
      LEFT JOIN public.user_permissions AS up
      ON ca.id = up.client_app_id
      LEFT JOIN public.app_permissions AS ap
      ON up.app_permission_id = ap.id
      WHERE CA.name = '#{ENV['CLIENT_APP_PERMISSION']}'
      AND up.user_id = #{current_user.id}
      AND up.deleted_at IS null
    "
    ups = UserPermission.find_by_sql(sql)
    ups.each do |up|
      permissions << {
        'permission_name': up[:permission_name],
        'action': up[:action],
        'group': up[:display_name],
        'is_allowed': true
      }
    end

    return permissions
  end

  def is_permissible(permission_name, action_name)
    ClientApp
      .select("client_apps.name, app_permissions.permission_name, app_permissions.action, app_permissions.display_name, app_permissions.group")
      .joins("LEFT JOIN user_permissions ON client_apps.id = user_permissions.client_app_id")
      .joins("LEFT JOIN app_permissions ON user_permissions.app_permission_id = app_permissions.id")
      .where("client_apps.name = '#{ENV['CLIENT_APP_PERMISSION']}' AND user_permissions.user_id = #{current_user.id} AND user_permissions.deleted_at IS null AND app_permissions.permission_name = '#{permission_name}' AND app_permissions.action = '#{action_name}'")
      .first
  end
end