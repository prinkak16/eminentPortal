class CreateOrganizationTable < ActiveRecord::Migration[7.0]
  def change
    create_table :organizations do |t|
      t.integer :parent_id, null: true, default: nil
      t.integer :order_id, null: false, default: 1
      t.integer :country_state_id, null: true, foreign_key: {to_table: :states}, index: true, default: nil
      t.integer :ministry_id, foreign_key: {to_table: :ministries}, index: true
      t.integer :department_id, null: true, foreign_key: {to_table: :departments}, index: true, default: nil
      t.string :type, default: nil
      t.string :ratna_type, default: nil
      t.boolean :is_listed, default: false
      t.string :name, null: false, index: true
      t.string :slug, null: false, index: true
      t.string :abbreviation, default: nil
      t.jsonb :location, null: false, default: '{}'
      t.datetime :deleted_at, default: nil
      t.timestamps
    end
  end
end
