class Api::V1::Allotment::StatsController < BaseApiController
  before_action :authenticate_user
  include Validators::Allotment::Validator
  include UtilHelper
  include MinistryHelper
  include UserHelper
  include MailHelper

  def position_analytics
    begin
      permission_exist = is_permissible('GOMManagement', 'FilterMinistry')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :bad_request
      end

      country_states = []
      fetch_minister_assigned_country_states.each do |country_state|
        country_states << country_state[:id]
      end

      stats = {
        'total': 0,
        'assigned': 0,
        'yet_to_assigned': 0
      }

      sql = "
        SELECT
           SUM(CASE WHEN vac.allotment_status IN ('vacant') THEN 1 ELSE 0 END) AS yet_to_assigned,
           SUM(CASE WHEN vac.allotment_status IN ('occupied') THEN 1 ELSE 0 END) AS occupied,
           SUM(1) AS total
         FROM public.vacancies AS vac
         WHERE
           vac.deleted_at IS null
           AND
           vac.slotting_status IN ('slotted', 'outside_saral')
           AND
           vac.country_state_id IN (#{country_states.join(',')})
      "
      results = Vacancy.find_by_sql(sql)

      if results.present? && results[0].present?
        stats[:total] = results[0]['total'] || 0
        stats[:assigned] = results[0]['occupied'] || 0
        stats[:yet_to_assigned] = results[0]['yet_to_assigned'] || 0
      end
      return render json: { success: true, message: 'Success', data: stats }, status: :ok

    rescue StandardError => e
      return render json: {
        success: false,
        message: e.message
      }, status: :bad_request
    end
  end

  def list
    begin
      permission_exist = is_permissible('Eminent', 'ViewAll')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      # compute limit and offset
      limit = params[:limit].present? ? params[:limit] : 10
      offset = params[:offset].present? ? params[:offset] : 0
      is_download = params[:offset].present? ? params[:offset] : false

      # ministry id computation
      ministry_id_search = params[:ministry].present? ? params[:ministry] : nil

      # department id computation
      dept_id_search = params[:department].present? ? params[:department] : nil

      # organization id computation
      org_id_search = params[:organization].present? ? params[:organization] : nil

      # search by query
      query = params[:query].present? ? params[:query] : nil

      # ratna type id computation
      ratna_type_search = params[:ratna_type].present? ? params[:ratna_type].split(',') : nil
      if !ratna_type_search.nil? && ratna_type_search.length.positive?
        ratna_type_search = ratna_type_search.map { |element| "#{element}" }.join(',')
      end

      # state id computation
      country_states = params[:country_state_id].present? ? params[:country_state_id] : nil
      if country_states.nil?
        country_states = []
        fetch_minister_assigned_country_states.each do |country_state|
          country_states << country_state[:id]
        end
      end

      results = []
      sql = "
          SELECT
            ministry.id AS ministry_id,
            ministry.name AS ministry_name,
            dept.id AS dept_id,
            dept.name AS dept_name,
            org.id AS org_id,
            org.name AS org_name,
            org.is_listed AS is_listed,
            vac.country_state_id AS state_id,
            SUM(1) AS total,
            SUM(CASE WHEN vac.allotment_status = 'vacant' THEN 1 ELSE 0 END) AS vacant,
            SUM(CASE WHEN vac.allotment_status = 'occupied' THEN 1 ELSE 0 END) AS occupied
          FROM public.vacancies AS vac
          LEFT JOIN public.ministries AS ministry
          ON vac.ministry_id = ministry.id
          LEFT JOIN public.departments AS dept
          ON vac.department_id = dept.id
          LEFT JOIN public.organizations AS org
          ON vac.organization_id = org.id
          WHERE
            vac.id IS NOT null
            AND
            vac.deleted_at IS null
            AND
            vac.slotting_status IN ('slotted', 'outside_saral')
            AND
            vac.country_state_id IN (#{country_states.join(',')})
      "
      sql += " AND ministry.id IN (#{ministry_id_search})" unless ministry_id_search.nil?
      sql += " AND dept.id IN (#{dept_id_search})" unless dept_id_search.nil?
      sql += " AND org.id IN (#{org_id_search})" unless org_id_search.nil?
      sql += " AND org.ratna_type IN (#{ratna_type_search})" unless ratna_type_search.nil?
      sql += " AND (LOWER(ministry.name) LIKE LOWER('%#{query}%') OR LOWER(org.name) LIKE LOWER('%#{query}%'))" unless query.nil?
      sql += "
          GROUP BY
            ministry.id,
            ministry.name,
            org.id,
            org.name,
            dept.id,
            dept.name,
            vac.country_state_id
      "
      stats = Vacancy.find_by_sql(sql + " LIMIT #{limit} OFFSET #{offset};")

      stats.each do |stat|
        results << {
          ministry_id: stat.ministry_id.present? ? stat.ministry_id : nil,
          ministry_name: stat.ministry_name.present? ? stat.ministry_name : nil,
          dept_id: stat.dept_id.present? ? stat.dept_id : nil,
          dept_name: stat.dept_name.present? ? stat.dept_name : nil,
          org_id: stat.org_id.present? ? stat.org_id : nil,
          org_name: stat.org_name.present? ? stat.org_name : nil,
          is_listed: stat.is_listed.present? ? stat.is_listed : nil,
          total: stat.total.present? ? stat.total : 0,
          vacant: stat.vacant.present? ? stat.vacant : 0,
          occupied: stat.occupied.present? ? stat.occupied : 0,
          assigned_states: stat.state_id.present? ? CountryState.find_by(id: stat.state_id)&.name : '',
          assigned_state_id: stat.state_id
        }
      end

      return render json: {
        success: true,
        message: 'Success',
        data: {
          value: results,
          count: Vacancy.find_by_sql(sql).count
        }
      }, status: :ok

    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def assign_position_info
    begin
      # check if user have permission
      permission_exist = is_permissible('Eminent', 'ViewAll')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      # check if params is validated or not
      params['organization_id'] = params['organization_id'].to_i
      is_param_data_is_valid = validate_form(assign_position_info_validator, params.as_json)
      unless is_param_data_is_valid[:is_valid]
        return render json: {
          success: false,
          message: 'Invalid request',
          error: is_param_data_is_valid[:error]
        }, status: :bad_request
      end

      stats = {
        "ministry_id": nil,
        "ministry_name": nil,
        "organization_id": nil,
        "organization_name": nil,
        "location": '{}',
        "department_id": nil,
        "department_name": nil,
        "slotting_remarks": [],
        "vacant": 0,
        "occupied": 0,
        "total": 0
      }

      # fetch organizations
      sql = "
        SELECT
          ministry.id AS ministry_id,
          ministry.name AS ministry_name,
          org.id AS organization_id,
          org.name AS organization_name,
          org.location,
          dept.id AS department_id,
          dept.name AS department_name,
          jsonb_agg(DISTINCT vac.slotting_remarks) AS slotting_remarks,
          SUM(CASE WHEN vac.allotment_status IN ('vacant') AND vac.slotting_status = 'slotted' THEN 1 ELSE 0 END) AS vacant,
          SUM(CASE WHEN vac.allotment_status IN ('occupied') AND vac.slotting_status = 'slotted' THEN 1 ELSE 0 END) AS occupied,
          SUM(CASE WHEN vac.slotting_status = 'slotted' THEN 1 ELSE 0 END) AS total
        FROM public.organizations AS org
        LEFT JOIN public.ministries AS ministry
        ON org.ministry_id = ministry.id
        LEFT JOIN public.departments AS dept
        ON org.department_id = dept.id
        LEFT JOIN public.vacancies AS vac
        ON org.id = vac.organization_id
        WHERE
          org.id = #{params['organization_id']}
          AND
          org.deleted_at IS null
        GROUP BY org.id, dept.id, ministry.id
      "
      results = Organization.find_by_sql(sql)

      if results.present? && results[0].present?
        stats[:ministry_id] = results[0]['ministry_id'] || nil
        stats[:ministry_name] = results[0]['ministry_name'] || nil
        stats[:organization_id] = results[0]['organization_id'] || nil
        stats[:organization_name] = results[0]['organization_name'] || nil
        stats[:location] = results[0]['location'] || '{}'
        stats[:department_id] = results[0]['department_id'] || nil
        stats[:department_name] = results[0]['department_name'] || nil
        stats[:slotting_remarks] = results[0]['slotting_remarks'].present? ? results[0]['slotting_remarks'].reject { |item| item.nil? || item == '' } : []
        stats[:vacant] = results[0]['vacant'] || 0
        stats[:occupied] = results[0]['occupied'] || 0
        stats[:total] = results[0]['total'] || 0
      end
      return render json: {
        success: true,
        message: 'Success',
        data: stats
      }, status: :ok
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def psu_details
    begin
      # check if user have permission
      permission_exist = is_permissible('Eminent', 'ViewAll')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end
      psu_id = params[:psu_id]
      raise "PSU Id can't be blank." unless psu_id.present?

      raise "State Id can't be blank." unless params[:state_id].present?

      country_state = CountryState.find_by(id: params[:state_id])
      raise 'Country state is not found.' unless country_state.present?

      psu_details = Organization.joins(:ministry, :vacancies)
                                .where(id: psu_id)
                                .where(vacancies: { slotting_status: 'slotted', country_state_id: country_state.id })
                                .select("organizations.id as psu_id, organizations.name as psu_name, ministries.name as ministry_name,
                                                count(distinct vacancies.id) as total_vacancy_count, count(case when vacancies.allotment_status = 'vacant' then 1 end) as vacant_vacancy_count,
                                                count(case when vacancies.allotment_status = 'occupied' then 1 end) as assigned_vacancy_count, string_agg(distinct vacancies.slotting_remarks, ', ') AS remarks,
                                                array_agg(DISTINCT vacancies.country_state_id) as states")
      if psu_details.exists?
        psu_data = {
          psu_id: psu_details.first.psu_id,
          psu_name: psu_details.first.psu_name,
          ministry_name: psu_details.first.ministry_name,
          total_vacancy_count: psu_details.first.total_vacancy_count,
          vacant_vacancy_count: psu_details.first.vacant_vacancy_count,
          assigned_vacancy_count: psu_details.first.assigned_vacancy_count,
          slotting_remark: psu_details.first.remarks,
          location: CountryState.where(id: psu_details.first.states).pluck(:name)&.join(', ')
        }

        return render json: {
          success: true,
          message: 'Data received successfully.',
          data: psu_data
        }
      else
        raise 'No PSU found.'
      end
    end
  rescue StandardError => e
    return render json: { success: false, message: e.message }, status: :bad_request
  end
end