class AuthUser < ApplicationRecord
  acts_as_paranoid
  scope :name_similar, ->(search) {
    select(:id, :name, "word_similarity(name, '#{search}') AS ms")
      .where('name % :name', name: search)
      .order(ms: :desc)
  }

  belongs_to :assist_to, class_name: 'AuthUser', optional: true
  has_many :user_ministries, foreign_key: 'user_id', dependent: :destroy
  has_many :ministries, through: :user_ministries

  def assigned_ministry
    user_ministries.where(is_minister: false)
  end
end