class Vacancy < ApplicationRecord
  self.table_name = 'vacancies'

  scope :name_similar, ->(search) {
    select('id', 'designation', "word_similarity(designation, '#{search}') AS ms")
      .where('designation % :designation', designation: search)
      .order(ms: :desc)
  }

  acts_as_paranoid
end