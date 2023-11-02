class AddAssistToInUserTable < ActiveRecord::Migration[7.0]
  def change
    add_column :auth_users, :assist_to_id, :integer, foreign_key: { to_table: :auth_users }, index: true, default: nil
  end
end
