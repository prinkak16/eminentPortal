class FileStatusLevel < ApplicationRecord
  scope :name_similar, ->(name) { where('name % :name', name: name) }

end
