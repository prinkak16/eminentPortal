class AddCcdmUserIdColumnToUserTable < ActiveRecord::Migration[7.0]
  def change
    add_column :auth_users, :phone_number, :string
  end
end
