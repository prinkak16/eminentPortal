class CreateFileStatusAllotmentTable < ActiveRecord::Migration[7.0]
  def change
    create_table :file_status do |t|
      t.integer :vacancy_allotment_id, null: true, foreign_key: { to_table: :vacancies }, index: true, default: nil
      t.string :file_status, null: true, default: nil
      t.bigint :action_by_id, null: true, foreign_key: { to_table: :auth_users }, index: true, default: nil
      t.timestamps
      t.datetime :deleted_at, default: nil
    end
  end
end
