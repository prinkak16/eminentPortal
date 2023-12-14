class FileStatusActivity < ApplicationRecord
  belongs_to :vacancy_allotment
  belongs_to :file_status_level
  belongs_to :file_status, class_name: 'FileStatus'
end
