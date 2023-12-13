module FilterHelper
  include ApplicationHelper

  def get_entry_type_filter
    result = {
      'key': 'entry_type',
      'display_name': 'Entry Type',
      'type': 'array',
      'values': []
    }

    fetch_user_assigned_country_states.each do |country_state|
      result[:values] << {
        'value': country_state['id'],
        'display_name': country_state['name']
      }
    end
    result
  end

  def get_channel_filter
    {
      'key': 'channel',
      'type': 'array',
      'display_name': 'Channel',
      'values': [
        {
          'value': 'Office',
          'display_name': 'Office'
        },
        {
          'value': 'Link',
          'display_name': 'Link'
        }
      ]
    }
  end

  def get_aasm_state_filter
    {
      'key': 'form_status',
      'type': 'array',
      'display_name': 'Form Status',
      'values': [
        {
          'value': 'pending',
          'display_name': 'Pending'
        },
        {
          'value': 'otp_verified',
          'display_name': 'OTP Verified'
        },
        {
          'value': 'incomplete',
          'display_name': 'Incomplete'
        },
        {
          'value': 'submitted',
          'display_name': 'Submitted'
        },
        {
          'value': 'rejected',
          'display_name': 'Re-edit'
        },
        {
          'value': 'approved',
          'display_name': 'Freeze'
        }
      ]
    }
  end

  def get_qualification_filter
    result = {
      'key': 'education',
      'type': 'array',
      'display_name': 'Qualification',
      'values': []
    }
    educations = PersonEducation.order(:order).select(:id, :name)
    educations.each do |education|
      result[:values] << {
        'value': education.name,
        'display_name': education.name
      }
    end
    result
  end

  def get_gender_filter
    result = {
      'key': 'gender',
      'type': 'array',
      'display_name': 'Gender',
      'values': [
        {
          'value': 'Male',
          'display_name': 'Male'
        },
        {
          'value': 'Female',
          'display_name': 'Female'
        },
        {
          'value': 'Others',
          'display_name': 'Others'
        }
      ]
    }
  end

  def get_profession_filter
    result = {
      'key': 'profession',
      'type': 'array',
      'display_name': 'Profession',
      'values': []
    }
    professions = PersonProfession.select(:id, :name)
    professions.each do |profession|
      result[:values] << {
        'value': profession.name,
        'display_name': profession.name
      }
    end
    result
  end

  def get_category_filter
    result = {
      'key': 'category',
      'type': 'array',
      'display_name': 'Category',
      'values': []
    }
    condition = "CASE person_categories.name WHEN 'GEN' THEN '1' WHEN 'OBC' THEN '2' WHEN 'SC' THEN '3' WHEN 'ST' THEN '4' WHEN 'Minority' THEN '5' else 100 END"
    categories = PersonCategory.all.order(Arel.sql(condition)).select(:id, :name)
    categories.each do |category|
      result[:values] << {
        'value': category.name,
        'display_name': category.name
      }
    end
    result
  end

  def get_age_group_filter
    result = {
      'key': 'age_group',
      'type': 'array',
      'display_name': 'Age Group',
      'values': [
        {
          'value': 'age_18_to_25',
          'display_name': '18-25'
        },
        {
          'value': 'age_25_to_30',
          'display_name': '25-30'
        },
        {
          'value': 'age_30_to_35',
          'display_name': '30-35'
        },
        {
          'value': 'age_35_to_40',
          'display_name': '35-40'
        },
        {
          'value': 'age_40_to_45',
          'display_name': '40-45'
        },
        {
          'value': 'age_45_to_50',
          'display_name': '45-50'
        },
        {
          'value': 'age_50_to_65',
          'display_name': '50-65'
        },
        {
          'value': 'age_greater_65',
          'display_name': '65+'
        }
      ]
    }
  end

  def get_minister_filters(search)
    result = {
      'key': 'minister_ids',
      'display_name': 'Minister',
      'type': 'array',
      'values': []
    }
    ministry_details = AuthUser.where(assist_to_id: nil)
    if search.length > 2
      ministry_details = AuthUser.name_similar(search).where(assist_to_id: nil)
    end

    ministry_details.each do |minister_info|
      result[:values] << {
        'value': minister_info[:id],
        'display_name': minister_info[:name]
      }
    end
    result
  end

  def get_ministry_filters(search)
    result = {
      'key': 'ministry_ids',
      'display_name': 'Ministry',
      'type': 'array',
      'values': []
    }
    ministry_details = Ministry.all()
    if search.length > 2
      ministry_details = Ministry.name_similar(search)
    end

    ministry_details.each do |ministry_info|
      result[:values] << {
        'value': ministry_info[:id],
        'display_name': ministry_info[:name]
      }
    end
    result
  end

  def get_file_statuses_filters(search)
    result = {
      'key': 'file_status',
      'display_name': 'File Status',
      'type': 'array',
      'values': []
    }

    file_statuses = FileStatusLevel.select(:id, :name)
    if search.length > 2
      file_statuses = FileStatusLevel.name_similar(search)
    end

    file_statuses.each do |status|
      result[:values] << {
        'value': status[:id],
        'display_name': status[:name]
      }
    end
    result
  end
end