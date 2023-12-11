class AuthUser < ApplicationRecord
  acts_as_paranoid
  scope :name_similar, ->(search) {
    select(:id, :name, "word_similarity(name, '#{search}') AS ms")
      .where('name % :name', name: search)
      .order(ms: :desc)
  }

  belongs_to :assist_to, class_name: 'AuthUser', optional: true
end