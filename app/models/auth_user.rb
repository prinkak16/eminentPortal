class AuthUser < ApplicationRecord
  belongs_to :assist_to, class_name: 'AuthUser', optional: true
end