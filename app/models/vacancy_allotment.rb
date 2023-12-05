class VacancyAllotment < ApplicationRecord
  self.table_name = 'vacancy_allotments'

  belongs_to :vacancy, class_name: 'Vacancy'
  belongs_to :custom_member_form, class_name: 'CustomMemberForm'
end