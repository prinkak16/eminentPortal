class ChangeColumnNameInVacancyAllotment < ActiveRecord::Migration[7.0]
  def change
    rename_column :vacancy_allotments, :file_status, :file_status_id
  end
end
