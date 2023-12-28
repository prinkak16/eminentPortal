class AddDeletedAtToFileStatusActivity < ActiveRecord::Migration[7.0]
  def change
    add_column :file_status_activities, :deleted_at, :string
  end
end
