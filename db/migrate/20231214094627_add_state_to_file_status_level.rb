class AddStateToFileStatusLevel < ActiveRecord::Migration[7.0]
  def change
    add_column :file_status_levels, :state, :string
  end
end
