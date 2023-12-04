class AddIsAdminToAuthUserTable < ActiveRecord::Migration[7.0]
  def change
    add_column :auth_users, :is_admin, :boolean, default: false
  end
end
