class CreateUserMinistries < ActiveRecord::Migration[7.0]
  def change
    create_table :user_ministries do |t|
      t.integer :user_id, foreign_key: {to_table: :auth_users}, index: true
      t.integer :ministry_id, foreign_key: {to_table: :ministries}, index: true
      t.boolean :is_minister, null: false, default: false
      t.boolean :has_ministry, null: false, default: false
      t.timestamps
    end
  end
end
