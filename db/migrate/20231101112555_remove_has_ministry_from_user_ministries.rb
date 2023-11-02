class RemoveHasMinistryFromUserMinistries < ActiveRecord::Migration[7.0]
  def change
    remove_column :user_ministries, :has_ministry
  end
end
