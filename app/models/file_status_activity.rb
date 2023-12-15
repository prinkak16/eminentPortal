class FileStatusActivity < ApplicationRecord
  belongs_to :vacancy_allotment
  has_many :file_status_levels
  belongs_to :file_status, class_name: 'FileStatus'
end
