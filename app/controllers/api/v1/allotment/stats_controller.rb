class Api::V1::Allotment::StatsController < BaseApiController
  before_action :authenticate_user
  include Validators::User::Validator
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
      fetch_user_assigned_country_states.each do |country_state|
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
      return render json: { success: true, message: 'Success', data: stats, test: country_states }, status: :ok

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
        fetch_user_assigned_country_states.each do |country_state|
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
end