class AddAssistToInUserTable < ActiveRecord::Migration[7.0]
  def change
    enable_extension :pg_trgm

    add_column :auth_users, :assist_to_id, :integer, foreign_key: { to_table: :auth_users }, index: true, default: nil
    add_column :auth_users, :deleted_at, :datetime, default: nil

    add_index :auth_users, :name, opclass: :gin_trgm_ops, using: :gin, name: 'index_user_name_search'
  end
end
