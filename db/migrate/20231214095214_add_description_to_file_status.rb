class AddDescriptionToFileStatus < ActiveRecord::Migration[7.0]
  def change
    add_column :file_status, :description, :string
  end
end
