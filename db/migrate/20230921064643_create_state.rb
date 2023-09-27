class CreateState < ActiveRecord::Migration[7.0]
  def change
    create_table :states, id: false  do |t|
      t.integer :id, null: false, primary_key: true
      t.string :name, null: false, unique: true
      t.string :state_code, null: false, unique: true
      t.timestamps
    end
  end
end
