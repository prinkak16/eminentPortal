class CreateFileStatusActivities < ActiveRecord::Migration[7.0]
  def change
    create_table :file_status_activities do |t|
      t.integer :file_status_id
      t.references :vacancy_allotment, null: false, foreign_key: true
      t.references :file_status_level, null: false, foreign_key: true

      t.timestamps
    end
  end
end
