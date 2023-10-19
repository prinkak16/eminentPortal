class UserMinistry < ApplicationRecord
  self.table_name = 'user_ministries'

  belongs_to :user, class_name: 'User', optional: true
  belongs_to :ministry, class_name: 'Ministry', optional: true
  validates_uniqueness_of :user_id, scope: [:ministry_id, :is_minister], :allow_blank => false, :allow_nil => false
  validates_uniqueness_of :user_id, scope: [:ministry_id, :has_ministry], :allow_blank => false, :allow_nil => false
end