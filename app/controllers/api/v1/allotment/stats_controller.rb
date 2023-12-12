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
         FROM public.user_ministries AS um
         LEFT JOIN public.vacancies AS vac
         ON um.ministry_id = vac.ministry_id
         LEFT JOIN public.ministries AS ministry
         ON vac.ministry_id = ministry.id
         WHERE
           um.is_minister IS false
           AND
           vac.id IS NOT null
           AND
           vac.deleted_at IS null
           AND
           vac.slotting_status IN ('slotted', 'outside_saral')
           AND
           vac.country_state_id IN (#{country_states.join(',')})
           AND
           um.user_id = #{current_user.id}
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
            SUM(1) AS total,
            SUM(CASE WHEN vac.allotment_status = 'vacant' THEN 1 ELSE 0 END) AS vacant,
            SUM(CASE WHEN vac.allotment_status = 'occupied' THEN 1 ELSE 0 END) AS occupied
          FROM public.user_ministries AS um
          LEFT JOIN public.vacancies AS vac
          ON um.ministry_id = vac.ministry_id
          LEFT JOIN public.ministries AS ministry
          ON vac.ministry_id = ministry.id
          LEFT JOIN public.departments AS dept
          ON vac.department_id = dept.id
          LEFT JOIN public.organizations AS org
          ON vac.organization_id = org.id
          WHERE
            um.is_minister IS false
            AND
            vac.id IS NOT null
            AND
            vac.deleted_at IS null
            AND
            vac.slotting_status IN ('slotted', 'outside_saral')
            AND
            vac.country_state_id IN (#{country_states.join(',')})
            AND
            um.user_id = #{current_user.id}
      "
      sql += " AND ministry.id IN (#{ministry_id_search})" unless ministry_id_search.nil?
      sql += " AND dept.id IN (#{dept_id_search})" unless dept_id_search.nil?
      sql += " AND org.id IN (#{org_id_search})" unless org_id_search.nil?
      sql += " AND org.ratna_type IN (#{ratna_type_search})" unless ratna_type_search.nil?
      sql += "
          GROUP BY
            ministry.id,
            ministry.name,
            org.id,
            org.name,
            dept.id,
            dept.name
      "
      stats = UserMinistry.find_by_sql(sql + " LIMIT #{limit} OFFSET #{offset};")

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
          occupied: stat.occupied.present? ? stat.occupied : 0
        }
      end

      return render json: {
        success: true,
        message: 'Success',
        data: {
          value: results,
          count: UserMinistry.find_by_sql(sql).count
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
end