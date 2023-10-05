class CreateUser < ActiveRecord::Migration[7.0]
  def change
    create_table :auth_users, id: false do |t|
      t.bigint :id, null: false, primary_key: true
      t.string :name, null: false, default: ''
      t.timestamps
    end
  end
end
