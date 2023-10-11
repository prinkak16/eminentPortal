module CustomMemberFormConcern
  extend ActiveSupport::Concern

  included do
    scope 'age_18_to_25', -> {where("data->>'dob' != ''").where("date_part('year', age((data->>'dob')::timestamp)) >= 18 and date_part('year', age((data->>'dob')::timestamp)) < 25")}
    scope 'age_25_to_30', -> {where("data->>'dob' != ''").where("date_part('year', age((data->>'dob')::timestamp)) >= 25 and date_part('year', age((data->>'dob')::timestamp)) < 30")}
    scope 'age_30_to_35', -> {where("data->>'dob' != ''").where("date_part('year', age((data->>'dob')::timestamp)) >= 30 and date_part('year', age((data->>'dob')::timestamp)) < 35")}
    scope 'age_35_to_40', -> {where("data->>'dob' != ''").where("date_part('year', age((data->>'dob')::timestamp)) >= 35 and date_part('year', age((data->>'dob')::timestamp)) < 40")}
    scope 'age_40_to_45', -> {where("data->>'dob' != ''").where("date_part('year', age((data->>'dob')::timestamp)) >= 40 and date_part('year', age((data->>'dob')::timestamp)) < 45")}
    scope 'age_45_to_50', -> {where("data->>'dob' != ''").where("date_part('year', age((data->>'dob')::timestamp)) >= 45 and date_part('year', age((data->>'dob')::timestamp)) < 50")}
    scope 'age_50_to_65', -> {where("data->>'dob' != ''").where("date_part('year', age((data->>'dob')::timestamp)) >= 50 and date_part('year', age((data->>'dob')::timestamp)) < 65")}
    scope 'age_greater_65', -> {where("data->>'dob' != ''").where("date_part('year', age((data->>'dob')::timestamp)) > 65")}
  end
end