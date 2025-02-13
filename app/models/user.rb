class User < CcdmsRecord
  has_many :user_tags
  has_many :user_permissions
  has_many :client_apps, through: :user_permissions

  # serialize :sso_payload

  def has_app_access?
    client_apps.where(name: ENV['CLIENT_APP_PERMISSION']).exists?
  end
end