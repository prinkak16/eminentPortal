class FileStatus < ApplicationRecord
  self.table_name = 'file_status'

  belongs_to :vacancy_allotment, class_name: 'VacancyAllotment'
  belongs_to :action_by, class_name: 'AuthUser'
  belongs_to :vacancy_allotment
end