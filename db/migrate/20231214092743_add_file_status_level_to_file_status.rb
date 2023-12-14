class AddFileStatusLevelToFileStatus < ActiveRecord::Migration[7.0]
  def change
    add_column :file_status, :file_status_level_id, :integer
  end
end
