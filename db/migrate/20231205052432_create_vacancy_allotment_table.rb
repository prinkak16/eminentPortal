class CreateVacancyAllotmentTable < ActiveRecord::Migration[7.0]
  def change
    create_table :vacancy_allotments do |t|
      t.integer :vacancy_id, null: true, foreign_key: { to_table: :vacancies }, index: true, default: nil
      t.integer :custom_member_form_id, null: true, foreign_key: { to_table: :custom_member_forms }, index: true, default: nil
      t.string :remarks, default: ''
      t.string :file_status, null: true, default: nil
      t.datetime :unoccupied_at, default: nil
      t.timestamps
      t.datetime :deleted_at, default: nil
    end
  end
end
