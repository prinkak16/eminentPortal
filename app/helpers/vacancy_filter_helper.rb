module VacancyFilterHelper
  include ApplicationHelper
  def fetch_vacancy_ministry_filters(name)
    result = {
      'key': 'ministry',
      'display_name': 'Ministry',
      'type': 'array',
      'values': []
    }

    sql = 'SELECT ministry.id, ministry.name'
    sql += ", word_similarity(ministry.name, '#{name}') AS ms " if name.length > 2
    sql += "
      FROM public.user_ministries AS um
      LEFT JOIN public.ministries AS ministry
      ON um.ministry_id = ministry.id
    "
    sql += "WHERE um.is_minister IS false AND um.user_id = #{current_user.id}"
    sql += " AND ministry.name % '#{name}' ORDER BY ms DESC" if name.length > 2

    user_ministries = UserMinistry.find_by_sql(sql)

    user_ministries.each do |user_ministry|
      result[:values] << {
        'value': user_ministry['id'],
        'display_name': user_ministry['name']
      }
    end
    result
  end

  def fetch_vacancy_department_filters(name)
    result = {
      'key': 'department',
      'display_name': 'Department',
      'type': 'array',
      'values': []
    }

    sql = 'SELECT department.id, department.name'
    sql += ", word_similarity(department.name, '#{name}') AS ms " if name.length > 2
    sql += "
      FROM public.user_ministries AS um
      LEFT JOIN public.ministries AS ministry
      ON um.ministry_id = ministry.id
      LEFT JOIN public.departments AS department
      ON um.ministry_id = department.ministry_id
    "
    sql += "WHERE um.is_minister IS false AND um.user_id = #{current_user.id} AND department.id IS NOT null"
    sql += " AND department.name % '#{name}' ORDER BY ms DESC" if name.length > 2

    user_departments = UserMinistry.find_by_sql(sql)

    user_departments.each do |user_department|
      result[:values] << {
        'value': user_department['id'],
        'display_name': user_department['name']
      }
    end
    result
  end

  def fetch_vacancy_organization_filters(name)
    result = {
      'key': 'organization',
      'display_name': 'Organization',
      'type': 'array',
      'values': []
    }

    sql = 'SELECT org.id, org.name'
    sql += ", word_similarity(org.name, '#{name}') AS ms " if name.length > 2
    sql += "
      FROM public.user_ministries AS um
      LEFT JOIN public.ministries AS ministry
      ON um.ministry_id = ministry.id
      LEFT JOIN public.departments AS dept
      ON um.ministry_id = dept.ministry_id
      LEFT JOIN public.organizations AS org
      ON (um.ministry_id = org.ministry_id AND dept.id = org.department_id)
    "
    sql += "WHERE um.is_minister IS false AND um.user_id = #{current_user.id} AND org.id IS NOT null"
    sql += " AND org.name % '#{name}' ORDER BY ms DESC" if name.length > 2

    user_organizations = UserMinistry.find_by_sql(sql)

    user_organizations.each do |user_organization|
      result[:values] << {
        'value': user_organization['id'],
        'display_name': user_organization['name']
      }
    end
    result
  end

  def fetch_state_filter
    result = {
      'key': 'country_state_id',
      'display_name': 'State',
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

  def fetch_ratna_type_filter
    result = {
      'key': 'ratna_type',
      'display_name': 'Type',
      'type': 'array',
      'values': [
        {
          'value': 'Maharatna',
          'display_name': 'Maharatna'
        },
        {
          'value': 'Navratna',
          'display_name': 'Navratna'
        },
        {
          'value': 'Miniratna',
          'display_name': 'Miniratna'
        }
      ]
    }
  end

  def fetch_position_status_filter
    result = {
      'key': 'position_status',
      'display_name': 'Position Status',
      'type': 'array',
      'values': [
        {
          'value': 'VACANT',
          'display_name': 'Vacant'
        },
        {
          'value': 'OCCUPIED',
          'display_name': 'Occupied'
        }
      ]
    }
  end
end