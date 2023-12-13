class CreateFileStatusLevels < ActiveRecord::Migration[7.0]
  def change
    create_table :file_status_levels do |t|
      t.string :name

      t.timestamps
    end
  end
end
