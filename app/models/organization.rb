class Organization < ApplicationRecord
  self.table_name = 'organizations'
  acts_as_paranoid
  scope :name_similar, ->(name) { where('name % :name', name: name) }

  validates_uniqueness_of :slug, scope: [:ministry_id, :department_id]
  belongs_to :ministry, class_name: 'Ministry'
  belongs_to :department, class_name: 'Department', optional: true
  belongs_to :country_state, class_name: 'CountryState', optional: true
  has_many :vacancies, dependent: :destroy
end