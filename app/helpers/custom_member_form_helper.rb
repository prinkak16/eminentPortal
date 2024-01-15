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
          5,
          6
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
        'pattern': '^[5-9]{1}\\d{9}$',
        'minLength': 10,
        'maxLength': 10,
        'pattern_example': '9876543210'
      },
      'minItems': 1,
      'maxItems': 3
    },
    'name': {
      'type': 'string',
      'minLength': 2,
      'maxLength': 100
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
      'minLength': 2,
      'maxLength': 100
    },
    'category': {
      'type': 'string',
      'minLength': 2,
      'maxLength': 100
    },
    'caste': {
      'type': 'string',
      'minLength': 2,
      'maxLength': 100
    },
    'sub_caste': {
      'type': 'string',
      'maxLength': 100
    },
    'languages': {
      'type': 'array',
      'items': {
        'type': 'string',
        'maxLength': 30
      },
      'minItems': 1,
      'maxItems': 100
    },
    'dob': {
      'type': 'string',
      'format': 'date'
    },
    'aadhaar': {
      'type': 'string',
      'pattern': '^$|^\\d{12}$',
      'minLength': 0, # Min length of 12 characters
      'maxLength': 12, # Max length of 12 characters
      'pattern_example': '123456789012'
    },
    'voter_id': {
      'type': 'string',
      'pattern': '^$|^[A-Za-z]{3}\\d{7}$',
      'minLength': 0, # Min length of 12 characters
      'maxLength': 10, # Max length of 12 characters
      'pattern_example': 'ABC1234567'
    },
    'photo': {
      'type': 'string',
      'pattern': '^$|\A(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]+)+)\b',
      'pattern_example': 'www.domain.com/file.ext'
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
      'pattern': '^$|^\\d{3,6}$',
      'maxLength': 6,
      'pattern_example': '0120'
    },
    'landline': {
      'type': 'string',
      'pattern': '^$|^\\d{6,10}$',
      'maxLength': 12,
      'pattern_example': '22324252'
    },
    'email': {
      'type': 'string',
      'format': 'email'
    },
    'address': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'address_type': {
            'minLength': 1, # Min length of 3 characters
            'maxLength': 200 # Max length of 200 characters
          },
          'flat': {
            'type': 'string',
            'minLength': 1, # Min length of 3 characters
            'maxLength': 200 # Max length of 200 characters
          },
          'street': {
            'type': 'string',
            'minLength': 1, # Min length of 3 characters
            'maxLength': 200 # Max length of 200 characters
          },
          'district': {
            'type': 'string',
            'minLength': 1, # Min length of 3 characters
            'maxLength': 200 # Max length of 200 characters
          },
          'state': {
            'type': 'string',
            'minLength': 1, # Min length of 3 characters
            'maxLength': 200 # Max length of 200 characters
          },
          'pincode': {
            'type': 'string',
            'pattern': '^\\d{6}$',
            'minLength': 6,
            'maxLength': 6,
            'pattern_example': '110001'
          }
        },
        'required': %w[address_type flat street district state pincode]
      }
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
      address
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
          'start_year': {
            'type': [nil,'integer'],
            'minimum': 1900,
            'maximum': 3000
          },
          'end_year': {
            'type': [nil,'integer'],
            'minimum': 1900,
            'maximum': 3000
          },
          'highest_qualification': {
            'type': 'boolean'
          }
        },
        'required': %w[qualification course university college start_year end_year highest_qualification]
      },
      'minItems': 1,  # Ensure at least one object in the array
      'anyOf': [
        {
          'contains': {
            'type': 'object',
            'name': 'highest_qualification',
            'properties': {
              'highest_qualification': { 'const': true }
            }
          }
        }
      ]
    },
    'professions': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'profession': {
            'type': 'string',
            'maxLength': 200 # Max length of 200 characters
          },
          'organization': {
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
          },
        },
        'required': %w[profession organization position start_year end_year]
      }
    },
    'profession_description': {
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
      address
      educations
      professions
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
    'election_contested': {
      'type': 'boolean'
    },
    'election_fought': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
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
      address
      educations
      professions
      profession_description
      political_not_applicable
      political_profile
      rss_years
      bjp_years
      other_parties
      social_profiles
      election_contested
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
      }
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
        'type': 'string'
      }
    },
    'website': {
      'type': 'string',
      'pattern': '^$|\A(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]+)+)\b',
      'pattern_example': 'www.website.com'
    },
    'twitter': {
      'type': 'string',
      'pattern': '^$|\A(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]+)+)\b',
      'pattern_example': 'www.twitter.com'
    },
    'linkedin': {
      'type': 'string',
      'pattern': '^$|\A(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]+)+)\b',
      'pattern_example': 'www.linkedin.com'
    },
    'facebook': {
      'type': 'string',
      'pattern': '^$|\A(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]+)+)\b',
      'pattern_example': 'www.facebook.com'
    },
    'instagram': {
      'type': 'string',
      'pattern': '^$|\A(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]+)+)\b',
      'pattern_example': 'www.instagram.com'
    },
    'attachment': {
      'type': 'string',
      'pattern': '^$|\A(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]+)+)\b',
      'pattern_example': 'www.domain.com/file.ext'
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
      address
      educations
      professions
      profession_description
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
      attachment_name
    ]
  )

  sixth_step_validations = fifth_step_validations.merge(
    'reference': {
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
          'type': 'string'
        },
        'comments': {
          'type': 'string'
        }
      },
      'required': %w[name mobile bjp_id comments]
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
      address
      educations
      professions
      profession_description
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
      attachment_name
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
    if Rails.env == "production"
      response = HTTParty.post('http://34.93.208.112/send_sms', options)
      print "\n-------\nSent Message: #{message}\nResponse code is #{response&.code&.to_s}\n"
    else
      print "\n-------\nSent Message: #{message}"
    end

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

  def eminent_headers(custom_members)
    headers = ["State", "Id", "Name", "Photo", "Gender", "Religion", "Category", "Caste", "Sub Caste", "Languages", "dob", "Father", "Mother",
               "Spouse", "Children", "Aadhaar", "Voter Id", "Mobiles", "STD Code", "Landline", "Email", "Website", "Twitter", "Facebook",
               "LinkedIn", "Instagram"]

    addresses = custom_members.where(Arel.sql("data ->> 'address' IS NOT NULL"))
                              .order(Arel.sql("jsonb_array_length(data -> 'address') DESC")).first.data['address']

    # add address headers
    if addresses.is_a?(Array)
      addresses.each do |address|
        if convert_to_snake_case(address['address_type']) == CustomMemberForm::CURRENT_ADDRESS
          headers << "current_flat"
          headers << "current_street"
          headers << "current_district"
          headers << "current_state"
          headers << "current_pincode"
        elsif convert_to_snake_case(address['address_type']) == CustomMemberForm::HOME_ADDRESS
          headers << "home_flat"
          headers << "home_street"
          headers << "home_district"
          headers << "home_state"
          headers << "home_pincode"
        else
          # headers << "type_of_other_address"
          headers << "other_address_flat"
          headers << "other_address_street"
          headers << "other_address_district"
          headers << "other_address_state"
          headers << "other_address_pincode"
        end
      end
    end
    headers
  end
end