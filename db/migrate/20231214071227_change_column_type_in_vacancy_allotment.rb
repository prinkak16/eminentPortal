class ChangeColumnTypeInVacancyAllotment < ActiveRecord::Migration[7.0]
  def change
    change_column :vacancy_allotments, :file_status_id, 'integer USING CAST(file_status_id AS integer)'
  end
end
