class CreateVaccancyTable < ActiveRecord::Migration[7.0]
  def change
    create_table :vacancies do |t|
      t.integer :ministry_id, foreign_key: {to_table: :ministries}, index: true
      t.integer :department_id, null: true, foreign_key: {to_table: :departments}, index: true, default: nil
      t.integer :organization_id, null: true, foreign_key: {to_table: :organizations}, index: true, default: nil
      t.integer :country_state_id, ull: true, foreign_key: {to_table: :states}, index: true, default: nil
      t.string :designation, null: false, default: ''
      t.boolean :is_selected, null: false, default: false
      t.datetime :tenure_started_at, default: nil
      t.datetime :tenure_ended_at, default: nil
      t.string :status, null: false, default: 'VACANT'
      t.timestamps
      t.datetime :deleted_at, default: nil
    end
  end
end
