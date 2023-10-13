class Ministry < ApplicationRecord
  self.table_name = 'ministries'
  validates :name, presence: true, uniqueness: true
  validates :slug, presence: true, uniqueness: true
  acts_as_paranoid
end