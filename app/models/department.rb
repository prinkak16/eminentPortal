class Department < ApplicationRecord
  self.table_name = 'departments'
  acts_as_paranoid

  validates_uniqueness_of :slug, scope: :ministry_id
  belongs_to :ministry, class_name: 'Ministry'
end