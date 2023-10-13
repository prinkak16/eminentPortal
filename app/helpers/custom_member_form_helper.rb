module CustomMemberFormHelper
  @@schema_base = {
    'type': 'object',
    'properties': {
      'form_type': {
        'type': 'string',
        'enum': [
          'eminent_personality'
        ]
      },
      'data': {
        'type': 'object'
      },
      'device_info': {
        'type': 'object'
      },
      'is_draft': {
        'type': 'boolean'
      },
      'version': {
        'type': 'integer',
        'enum': [
          3
        ]
      },
      'form_step': {
        'type': 'integer',
        'enum': [
          1,
          2,
          3,
          4,
          5
        ]
      },
      'state_id': {
        'type': 'integer',
        'min': 1
      },
      'channel': {
        'type': 'string',
        'enum': [
          nil,
          'Link',
          'Office'
        ]
      },
    },
    'required': %w[form_type data device_info is_draft version form_step state_id]
  }

  first_step_validations = {
    'id': {
      'type' => [nil, 'integer']
    },
    'mobiles': {
      'type': 'array',
      'items': {
        'type': 'string',
        'minLength': 10, # Min length of 10 characters
        'maxLength': 10 # Max length of 10 characters
      },
      'minItems': 1, # Min length of 1 phone number
      'maxItems': 3 # Max length of 3 phone number
    },
    'name': {
      'type': 'string',
      'minLength': 2, # Min length of 3 characters
      'maxLength': 100 # Max length of 100 characters
    },
    'gender': {
      'type': 'string',
      'enum': [
        'Male',
        'Female',
        'Others'
      ]
    },
    'religion': {
      'type': 'string',
      'minLength': 2, # Min length of 3 characters
      'maxLength': 100 # Max length of 100 characters
    },
    'category': {
      'type': 'string',
      'minLength': 2, # Min length of 2 characters
      'maxLength': 100 # Max length of 100 characters
    },
    'caste': {
      'type': 'string',
      'minLength': 2, # Min length of 2 characters
      'maxLength': 100 # Max length of 100 characters
    },
    'sub_caste': {
      'type': 'string',
      'minLength': 2, # Min length of 2 characters
      'maxLength': 100 # Max length of 100 characters
    },
    'languages': {
      'type': 'array',
      'items': {
        'type': 'string',
        'minLength': 2, # Min length of 10 characters
        'maxLength': 30 # Max length of 10 characters
      },
      'minItems': 1, # Min length of 1 phone number
      'maxItems': 100 # Max length of 3 phone number
    },
    'dob': {
      'type': 'string',
      'format': 'date'
    },
    'aadhaar': {
      'type': 'string',
      'minLength': 0, # Min length of 12 characters
      'maxLength': 12 # Max length of 12 characters
    },
    'voter_id': {
      'type': 'string',
      'minLength': 0, # Min length of 12 characters
      'maxLength': 20 # Max length of 12 characters
    },
    'photo': {
      'type': 'string',
      'format': 'uri'
    }
  }

  @@schema_first_step_progress = {
    'type': 'object',
    'properties': first_step_validations,
    'required': %w[
      id
      mobiles
    ]
  }

  @@schema_first_step = @@schema_first_step_progress.merge(
    'required': %w[
      id
      mobiles
      name
      gender
      religion
      category
      caste
      languages
      dob
      photo
    ]
  )

  second_step_validations = first_step_validations.merge(
    'std_code': {
      'type': 'string',
      'maxLength': 6 # Max length of 100 characters
    },
    'landline': {
      'type': 'string',
      'maxLength': 12 # Max length of 20 characters
    },
    'email': {
      'type': 'string',
      'format': 'email'
    },
    'current_flat': {
      'type': 'string',
      'minLength': 1, # Min length of 3 characters
      'maxLength': 200 # Max length of 200 characters
    },
    'current_street': {
      'type': 'string',
      'minLength': 1, # Min length of 3 characters
      'maxLength': 200 # Max length of 200 characters
    },
    'current_district': {
      'type': 'string',
      'minLength': 1, # Min length of 3 characters
      'maxLength': 200 # Max length of 200 characters
    },
    'current_state': {
      'type': 'string',
      'minLength': 1, # Min length of 3 characters
      'maxLength': 200 # Max length of 200 characters
    },
    'current_pincode': {
      'type': 'string',
      'minLength': 6, # Min length of 6 characters
      'maxLength': 6 # Max length of 6 characters
    },
    'home_flat': {
      'type': 'string',
      'minLength': 1, # Min length of 3 characters
      'maxLength': 200 # Max length of 200 characters
    },
    'home_street': {
      'type': 'string',
      'minLength': 1, # Min length of 3 characters
      'maxLength': 200 # Max length of 200 characters
    },
    'home_district': {
      'type': 'string',
      'minLength': 1, # Min length of 3 characters
      'maxLength': 200 # Max length of 200 characters
    },
    'home_state': {
      'type': 'string',
      'minLength': 1, # Min length of 3 characters
      'maxLength': 200 # Max length of 200 characters
    },
    'home_pincode': {
      'type': 'string',
      'minLength': 6, # Min length of 6 characters
      'maxLength': 6 # Max length of 6 characters
    },
    "type_of_other_address": {
      'type': 'string',
      'minLength': 0, # Min length of 3 characters
      'maxLength': 100 # Max length of 100 characters
    },
    'other_flat': {
      'type': 'string',
      'maxLength': 200 # Max length of 200 characters
    },
    'other_street': {
      'type': 'string',
      'maxLength': 200 # Max length of 200 characters
    },
    'other_district': {
      'type': 'string',
      'maxLength': 200 # Max length of 200 characters
    },
    'other_state': {
      'type': 'string',
      'maxLength': 200 # Max length of 200 characters
    },
    'other_pincode': {
      'type': 'string',
      'minLength': 0, # Min length of 6 characters
      'maxLength': 6 # Max length of 6 characters
    },
    'check': {
      'type': 'boolean'
    }
  )

  @@schema_second_step_progress = {
    'type': 'object',
    'properties': second_step_validations,
    'required': %w[
      id
      mobiles
    ]
  }

  @@schema_second_step = @@schema_second_step_progress.merge(
    'required': %w[
      id
      mobiles
      name
      gender
      religion
      category
      caste
      languages
      dob
      photo
      email
      current_flat
      current_street
      current_district
      current_state
      current_pincode
      home_flat
      home_street
      home_district
      home_state
      home_pincode
      type_of_other_address
      other_flat
      other_street
      other_district
      other_state
      other_pincode
      check
    ]
  )

  third_step_validations = second_step_validations.merge(
    'educations': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'qualification': {
            'type': 'string',
            'enum': [
              'Less than 10th',
              '10th Pass',
              '12th Pass',
              'Graduate',
              'Post Graduate',
              'Diploma/ITI',
              'PhD and Above'
            ]
          },
          'school': {
            'type': [nil,'string'],
            'maxLength': 200 # Max length of 200 characters
          },
          'board': {
            'type': [nil,'string'],
            'maxLength': 200 # Max length of 200 characters
          },
          'year': {
            'type': [nil,'integer'],
            'minimum': 1900,
            'maximum': 3000
          },
          'subject': {
            'type': [nil,'string'],
            'maxLength': 200 # Max length of 200 characters
          },
          'stream': {
            'type': [nil,'string'],
            'maxLength': 200 # Max length of 200 characters
          },
          'course': {
            'type': [nil,'string'],
            'maxLength': 200 # Max length of 200 characters
          },
          'university': {
            'type': [nil,'string'],
            'maxLength': 200 # Max length of 200 characters
          },
          'college': {
            'type': [nil,'string'],
            'maxLength': 200 # Max length of 200 characters
          },
          'department': {
            'type': [nil,'string'],
            'maxLength': 200 # Max length of 200 characters
          },
          'start_year': {
            'type': [nil,'integer'],
            'minimum': 1900,
            'maximum': 3000
          },
          'end_year': {
            'type': [nil,'integer'],
            'minimum': 1900,
            'maximum': 3000
          }
        },
        'required': %w[qualification school board year subject stream course university college department start_year end_year]
      }
    },
    'education_level': {
      'type': [nil,'string'],
      'enum': [
        nil,
        'Less than 10th',
        '10th Pass',
        '12th Pass',
        'Graduate',
        'Post Graduate',
        'Diploma/ITI',
        'PhD and Above'
      ]
    },
    'profession': {
      'type': [nil,'string'],
      'maxLength': 200 # Max length of 200 characters
    },
    'professional_positions': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'profession': {
            'type': 'string',
            'maxLength': 200 # Max length of 200 characters
          },
          'organisation': {
            'type': 'string',
            'minLength': 2, # Min length of 200 characters
            'maxLength': 200 # Max length of 200 characters
          },
          'position': {
            'type': 'string',
            'minLength': 2, # Min length of 200 characters
            'maxLength': 200 # Max length of 200 characters
          },
          'start_year': {
            'type': [nil,'integer'],
            'minimum': 1900,
            'maximum': 3000
          },
          'end_year': {
            'type': [nil,'integer'],
            'minimum': 1900,
            'maximum': 3000
          }
        },
        'required': %w[profession organisation position start_year end_year]
      },
    },
    'description': {
      'type': 'string'
    }
  )

  @@schema_third_step_progress = {
    'type': 'object',
    'properties': third_step_validations,
    'required': %w[
      id
      mobiles
    ]
  }

  @@schema_third_step = @@schema_third_step_progress.merge(
    'required': %w[
      id
      mobiles
      name
      gender
      religion
      category
      caste
      languages
      dob
      photo
      email
      current_flat
      current_street
      current_district
      current_state
      current_pincode
      home_flat
      home_street
      home_district
      home_state
      home_pincode
      type_of_other_address
      other_flat
      other_street
      other_district
      other_state
      other_pincode
      check
      educations
      education_level
      profession
      professional_positions
      description
    ]
  )

  fourth_step_validations = third_step_validations.merge(
    'political_not_applicable': {
      'type': 'boolean'
    },
    'political_profile': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'party_level': {
            'type': 'string',
            'maxLength': 200 # Max length of 200 characters
          },
          'unit': {
            'type': 'string',
            'maxLength': 200 # Max length of 200 characters
          },
          'designation': {
            'type': 'string',
            'maxLength': 200 # Max length of 200 characters
          },
          'start_year': {
            'type': [nil,'integer'],
            'minimum': 1900,
            'maximum': 3000
          },
          'end_year': {
            'type': [nil,'integer'],
            'minimum': 1900,
            'maximum': 3000
          }
        },
        'required': %w[party_level unit designation start_year end_year]
      },
    },
    'rss_years': {
      'type': [nil,'integer'],
      'minimum': 0,
      'maximum': 80
    },
    'bjp_years': {
      'type': [nil,'integer'],
      'minimum': 0,
      'maximum': 80
    },
    'other_parties': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'party': {
            'type': 'string',
            'maxLength': 200 # Max length of 200 characters
          },
          'position': {
            'type': 'string',
            'maxLength': 200 # Max length of 200 characters
          },
          'start_year': {
            'type': [nil,'integer'],
            'minimum': 1900,
            'maximum': 3000
          },
          'end_year': {
            'type': [nil,'integer'],
            'minimum': 1900,
            'maximum': 3000
          }
        },
        'required': %w[party position start_year end_year]
      },
    },
    'social_profiles': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'organization': {
            'type': 'string',
            'maxLength': 200 # Max length of 200 characters
          },
          'description': {
            'type': 'string',
          }
        },
        'required': %w[organization description]
      }
    },
    'election_fought': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'election_contested': {
            'type': 'boolean'
          },
          'contesting_year': {
            'type': [nil,'integer'],
            'minimum': 1900,
            'maximum': 3000
          },
          'electoral_type': {
            'type': 'string'
          },
          'state_name': {
            'type': 'string'
          },
          'ac_name': {
            'type': 'string'
          },
          'ad_name': {
            'type': 'string'
          },
          'pc_name': {
            'type': 'string'
          },
          'constituency_type': {
            'type': 'string'
          },
          'body_name': {
            'type': 'string'
          },
          'won': {
            'type': 'boolean'
          },
          'minister_portfolio': {
            'type': 'boolean'
          },
          'ministries': {
            'type': 'array',
            'items': {
              'type': 'object',
              'properties': {
                'ministry_name': {
                  'type': 'string'
                },
                'designation': {
                  'type': 'string'
                },
                'duration': {
                  'type': 'integer'
                }
              },
              'required': %w[ministry_name designation duration]
            }
          }
        }
      }
    }
  )

  @@schema_fourth_step_progress = {
    'type': 'object',
    'properties': fourth_step_validations,
    'required': %w[
      id
      mobiles
    ]
  }

  @@schema_fourth_step = @@schema_fourth_step_progress.merge(
    'required': %w[
      id
      mobiles
      name
      gender
      religion
      category
      caste
      languages
      dob
      photo
      email
      current_flat
      current_street
      current_district
      current_state
      current_pincode
      home_flat
      home_street
      home_district
      home_state
      home_pincode
      type_of_other_address
      other_flat
      other_street
      other_district
      other_state
      other_pincode
      check
      educations
      education_level
      profession
      professional_positions
      description
      political_not_applicable
      political_profile
      rss_years
      bjp_years
      other_parties
      social_profiles
      election_fought
    ]
  )

  fifth_step_validations = fourth_step_validations.merge(
    'political_legacy': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'name': {
            'type': 'string',
            'maxLength': 200 # Max length of 200 characters
          },
          'profile': {
            'type': 'string',
            'maxLength': 200 # Max length of 200 characters
          },
          'relationship': {
            'type': 'string',
            'maxLength': 200 # Max length of 200 characters
          }
        },
        'required': %w[name profile relationship]
      },
    },
    'father': {
      'type': 'string',
      'maxLength': 200 # Max length of 200 characters
    },
    'mother': {
      'type': 'string',
      'maxLength': 200 # Max length of 200 characters
    },
    'spouse': {
      'type': 'string',
      'maxLength': 200 # Max length of 200 characters
    },
    'children': {
      'type': 'array',
      'items': {
        'type': 'string',
      }
    },
    'website': {
      'anyOf' => [
        {
          'type' => 'string',
          'format' => 'uri'
        },
        {
          'type' => 'string',
          'enum' => ['']
        }
      ]
    },
    'twitter': {
      'anyOf' => [
        {
          'type' => 'string',
          'format' => 'uri'
        },
        {
          'type' => 'string',
          'enum' => ['']
        }
      ]
    },
    'linkedin': {
      'anyOf' => [
        {
          'type' => 'string',
          'format' => 'uri'
        },
        {
          'type' => 'string',
          'enum' => ['']
        }
      ]
    },
    'facebook': {
      'anyOf' => [
        {
          'type' => 'string',
          'format' => 'uri'
        },
        {
          'type' => 'string',
          'enum' => ['']
        }
      ]
    },
    'instagram': {
      'anyOf' => [
        {
          'type' => 'string',
          'format' => 'uri'
        },
        {
          'type' => 'string',
          'enum' => ['']
        }
      ]
    },
    'attachment': {
      'anyOf' => [
        {
          'type' => 'string',
          'format' => 'uri'
        },
        {
          'type' => 'string',
          'enum' => ['']
        }
      ]
    }
  )

  @@schema_fifth_step_progress = {
    'type': 'object',
    'properties': fifth_step_validations,
    'required': %w[
      id
      mobiles
    ]
  }

  @@schema_fifth_step = @@schema_fifth_step_progress.merge(
    'required': %w[
      id
      mobiles
      name
      gender
      religion
      category
      caste
      languages
      dob
      photo
      email
      current_flat
      current_street
      current_district
      current_state
      current_pincode
      home_flat
      home_street
      home_district
      home_state
      home_pincode
      type_of_other_address
      other_flat
      other_street
      other_district
      other_state
      other_pincode
      check
      educations
      education_level
      profession
      professional_positions
      description
      political_not_applicable
      political_profile
      rss_years
      bjp_years
      other_parties
      social_profiles
      election_fought
      political_legacy
      father
      mother
      spouse
      children
      website
      twitter
      linkedin
      facebook
      instagram
      attachment
    ]
  )

  sixth_step_validations = fifth_step_validations.merge(
    'reference': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'name': {
            'type': 'string',
            'maxLength': 200 # Max length of 200 characters
          },
          'mobile': {
            'type': 'string',
            'minLength': 10, # Min length of 10 characters
            'maxLength': 10 # Max length of 10 characters
          },
          'bjp_id': {
            'type': 'string',
            'maxLength': 10 # Max length of 10 characters
          },
          'grade': {
            'type': 'string'
          },
          'comments': {
            'type': 'string'
          }
        },
        'required': %w[name mobile bjp_id grade comments]
      }
    }
  )

  @@schema_sixth_step_progress = {
    'type': 'object',
    'properties': sixth_step_validations,
    'required': %w[
      id
      mobiles
    ]
  }

  @@schema_sixth_step = @@schema_sixth_step_progress.merge(
    'required': %w[
      id
      mobiles
      name
      gender
      religion
      category
      caste
      languages
      dob
      photo
      email
      current_flat
      current_street
      current_district
      current_state
      current_pincode
      home_flat
      home_street
      home_district
      home_state
      home_pincode
      type_of_other_address
      other_flat
      other_street
      other_district
      other_state
      other_pincode
      check
      educations
      education_level
      profession
      professional_positions
      description
      political_not_applicable
      political_profile
      rss_years
      bjp_years
      other_parties
      social_profiles
      election_fought
      political_legacy
      father
      mother
      spouse
      children
      website
      twitter
      linkedin
      facebook
      instagram
      attachment
      reference
    ]
  )

  def fetch_member(phone, form_type)
    CustomMemberForm.where(phone:, form_type:)
      .or(CustomMemberForm.where("data -> 'mobiles' ? :query", query: phone)
      .where(form_type:))&.first
  end

  def send_sms(message, phone_number, ct_id = '1007440753033109730')
    require 'httparty'
    options = {
      headers: {
        "Content-Type": 'application/json',
        "api-key": 'notakey',
        "uuid": 'abd3668d-319d-46a6-9ba6-5f7d68abd6fb'
      },
      body: {
        "phone_number": phone_number.to_s,
        "type": 'OTP',
        "sender": 'BJPSRL',
        "message": message.to_s,
        "template_id": ct_id.to_s
      }.to_json
    }
    response = HTTParty.post('http://34.93.208.112/send_sms', options)
    print "\n-------\nSent Message: #{message}\nResponse code is #{response&.code&.to_s}\n"
  end

  def custom_member_exists?(phone_number, form_type, cm_id)
    CustomMemberForm.where.not(id: cm_id).where(phone: phone_number, form_type: form_type).exists? ||
      CustomMemberForm.where.not(id: cm_id).select("data -> 'mobiles' as mobiles, id").where("data->'mobiles' ?| array[:query]", query: phone_number).exists?
  end

  def custom_member_age_group_query(age_groups)
    total_age_groups = age_groups.length
    query = total_age_groups.positive? ? "data->>'dob' != '' AND" : ''

    age_groups&.each_with_index do |age_group, index|
      query += index.zero? ? ' (' : ' OR '
      case age_group
      when 'age_18_to_25'
        query += "(date_part('year', age((data->>'dob')::timestamp)) >= 18 AND date_part('year', age((data->>'dob')::timestamp)) < 25)"
      when 'age_25_to_30'
        query += "(date_part('year', age((data->>'dob')::timestamp)) >= 25 AND date_part('year', age((data->>'dob')::timestamp)) < 30)"
      when 'age_30_to_35'
        query += "(date_part('year', age((data->>'dob')::timestamp)) >= 30 AND date_part('year', age((data->>'dob')::timestamp)) < 35)"
      when 'age_35_to_40'
        query += "(date_part('year', age((data->>'dob')::timestamp)) >= 35 AND date_part('year', age((data->>'dob')::timestamp)) < 40)"
      when 'age_40_to_45'
        query += "(date_part('year', age((data->>'dob')::timestamp)) >= 40 AND date_part('year', age((data->>'dob')::timestamp)) < 45)"
      when 'age_45_to_50'
        query += "(date_part('year', age((data->>'dob')::timestamp)) >= 45 AND date_part('year', age((data->>'dob')::timestamp)) < 50)"
      when 'age_50_to_65'
        query += "(date_part('year', age((data->>'dob')::timestamp)) >= 50 AND date_part('year', age((data->>'dob')::timestamp)) < 65)"
      when 'age_greater_65'
        query += "(date_part('year', age((data->>'dob')::timestamp)) > 65)"
      end
    end
    query += total_age_groups.positive? ? ')' : ''
  end
end