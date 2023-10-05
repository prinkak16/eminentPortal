module CustomMemberFormConcern
  extend ActiveSupport::Concern

  included do
    scope :age_upto_40, -> {where("data->>'dob' != ''").where("date_part('year', age((data->>'dob')::timestamp)) < 40")}
    scope :age_40_to_60, -> {where("data->>'dob' != ''").where("date_part('year', age((data->>'dob')::timestamp)) >= 40 and date_part('year', age((data->>'dob')::timestamp)) <= 60")}
    scope :age_greater_60, -> {where("data->>'dob' != ''").where("date_part('year', age((data->>'dob')::timestamp)) > 60")}
  end
end