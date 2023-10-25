class CreateMinistryTable < ActiveRecord::Migration[7.0]
  def change
    enable_extension :pg_trgm

    create_table :ministries do |t|
      t.string :name, null: false, index: true
      t.string :slug, null: false, index: true
      t.integer :order_id, null: false, default: 1
      t.datetime :deleted_at, default: nil
      t.timestamps
      t.index :name, opclass: :gin_trgm_ops, using: :gin, name: 'index_ministry_name_search'
    end
  end
end