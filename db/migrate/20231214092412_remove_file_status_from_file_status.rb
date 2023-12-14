class RemoveFileStatusFromFileStatus < ActiveRecord::Migration[7.0]
  def change
    remove_column :file_status, :file_status, :string
  end
end
