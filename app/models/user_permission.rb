class UserPermission < CcdmsRecord
  belongs_to :user
  belongs_to :user_tag
  belongs_to :client_app
end