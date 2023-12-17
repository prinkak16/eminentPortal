class Ministry < ApplicationRecord
  self.table_name = 'ministries'

  has_many :user_ministries
  has_many :vacancies, dependent: :destroy
  has_many :departments, dependent: :destroy
  has_many :organizations, dependent: :destroy
  has_many :user_ministries, dependent: :destroy

  scope :name_similar, ->(search) {
    select(:id, :name, "word_similarity(name, '#{search}') AS ms")
      .where('name % :name', name: search)
      .order(ms: :desc)
  }

  validates :name, presence: true, uniqueness: true
  validates :slug, presence: true, uniqueness: true
  acts_as_paranoid
end