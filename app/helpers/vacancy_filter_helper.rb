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
      FROM public.ministries AS ministry
    "
    sql += " AND ministry.name % '#{name}' ORDER BY ms DESC" if name.length > 2

    ministries = Ministry.find_by_sql(sql)

    ministries.each do |ministry|
      result[:values] << {
        'value': ministry['id'],
        'display_name': ministry['name']
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
      FROM public.ministries AS ministry
      LEFT JOIN public.departments AS department
      ON ministry.id = department.ministry_id
    "
    sql += " AND department.name % '#{name}' ORDER BY ms DESC" if name.length > 2

    departments = Ministry.find_by_sql(sql)

    departments.each do |department|
      result[:values] << {
        'value': department['id'],
        'display_name': department['name']
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
      FROM public.ministries AS ministry
      LEFT JOIN public.departments AS dept
      ON ministry.id = dept.ministry_id
      LEFT JOIN public.organizations AS org
      ON (ministry.id = org.ministry_id AND dept.id = org.department_id)
    "
    sql += " AND org.name % '#{name}' ORDER BY ms DESC" if name.length > 2

    organizations = Ministry.find_by_sql(sql)

    organizations.each do |organization|
      result[:values] << {
        'value': organization['id'],
        'display_name': organization['name']
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
          'value': 'vacant',
          'display_name': 'Vacant'
        },
        {
          'value': 'occupied',
          'display_name': 'Occupied'
        }
      ]
    }
  end
end