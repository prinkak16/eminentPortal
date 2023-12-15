class FileStatusLevel < ApplicationRecord
  scope :name_similar, ->(name) { where('name % :name', name: name) }
  belongs_to :file_status
  belongs_to :file_status_activity
end
