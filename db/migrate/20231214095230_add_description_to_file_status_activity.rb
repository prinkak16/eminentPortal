class AddDescriptionToFileStatusActivity < ActiveRecord::Migration[7.0]
  def change
    add_column :file_status_activities, :description, :string
  end
end
