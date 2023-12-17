class VacancyAllotment < ApplicationRecord
  self.table_name = 'vacancy_allotments'
  acts_as_paranoid

  belongs_to :vacancy, class_name: 'Vacancy'
  has_one :file_status, dependent: :destroy
  has_many :file_status_activities, dependent: :destroy
  belongs_to :custom_member_form, class_name: 'CustomMemberForm'
end