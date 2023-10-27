class AddEminentUpdatedAtColumnCustomMember < ActiveRecord::Migration[7.0]
  def change
    add_column :custom_member_forms, :eminent_updated_at, :datetime, default: nil
    add_column :custom_member_forms, :office_updated_at, :datetime, default: nil
  end
end
