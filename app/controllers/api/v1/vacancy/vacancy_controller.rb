class Api::V1::Vacancy::VacancyController < BaseApiController
  before_action :authenticate_user
  include CustomMemberFormHelper
  include UtilHelper
  include MetadataHelper

  def position_analytics
    begin
      permission_exist = is_permissible('Eminent', 'ViewAll')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      stats = {
        'total': 0,
        'occupied': 0,
        'vacant': 0
      }
      sql = "
        SELECT
           SUM(CASE WHEN vac.allotment_status = 'vacant' THEN 1 ELSE 0 END) AS vacant,
           SUM(CASE WHEN vac.allotment_status = 'occupied' THEN 1 ELSE 0 END) AS occupied,
           SUM(1) AS total
         FROM public.vacancies AS vac
         WHERE
           vac.deleted_at IS null
      "
      results = Vacancy.find_by_sql(sql)

      if results.present? && results[0].present?
        stats[:total] = results[0]['total'] || 0
        stats[:occupied] = results[0]['occupied'] || 0
        stats[:vacant] = results[0]['vacant'] || 0
      end
      return render json: { success: true, message: 'Success', data: stats }, status: :ok
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def vacant_overview_by_state
    begin
      permission_exist = is_permissible('Eminent', 'ViewAll')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      state_details = {}
      all_country_states = CountryState.all
      all_country_states.each do |country_state|
        state_details[country_state['id']] = {
          count: 0,
          cs_id: country_state[:id],
          cs_name: country_state[:name]
        }
      end

      results = Vacancy
                  .select('COUNT(*) AS vacant, country_state_id AS cs_id')
                  .where(allotment_status: 'vacant')
                  .where.not(country_state_id: nil)
                  .group('country_state_id')
                  .order('country_state_id ASC')

      results.each do |result|
        state_details[result['cs_id']][:count] = result['vacant']
      end

      return render json: { success: true, message: 'Success', data: state_details.values }, status: :ok
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
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

      # compute search by
      search_by = params[:search_by].present? ? params[:search_by] : 'ministry_wise'
      unless ['ministry_wise', 'organization_wise', 'vacancy_wise'].include?(search_by)
        return render json: {
          success: false,
          message: 'Invalid search by, allowed types are(ministry_wise, organization_wise, vacancy_wise).'
        }, status: :bad_request
      end

      # compute order by
      order_by = params[:order_by].present? ? params[:order_by] : 'ministry_name'
      case search_by
      when 'ministry_wise'
        unless ['ministry_name', 'vacant', 'occupied', 'total'].include?(order_by)
          return render json: {
            success: false,
            message: 'Invalid order by, allowed types are(ministry_name, vacant, occupied, total).'
          }, status: :bad_request
        end
      when 'organization_wise'
        unless ['ministry_name', 'dept_name', 'org_name', 'is_listed', 'vacant', 'occupied', 'total'].include?(order_by)
          return render json: {
            success: false,
            message: 'Invalid order by, allowed types are(ministry_name, dept_name, org_name, is_listed, vacant, occupied, total).'
          }, status: :bad_request
        end
      when 'vacancy_wise'
        unless ['ministry_name', 'dept_name', 'org_name', 'designation', 'status', 'tenure_started_at', 'tenure_ended_at'].include?(order_by)
          return render json: {
            success: false,
            message: 'Invalid order by, allowed types are(ministry_name, dept_name, org_name, is_listed, vacant, occupied, total).'
          }, status: :bad_request
        end
      end

      # compute order type
      order_type = params[:order_type].present? ? params[:order_type] : 'ASC'
      unless ['ASC', 'DESC'].include?(order_type)
        return render json: {
          success: false,
          message: 'Invalid order type, allowed types are(ASC, DESC).'
        }, status: :bad_request
      end
      is_download = params[:offset].present? ? params[:offset] : false

      # state id computation
      state_id_search = params[:country_state_id].present? ? params[:country_state_id] : nil

      # ministry id computation
      ministry_id_search = params[:ministry].present? ? params[:ministry] : nil

      # department id computation
      dept_id_search = params[:department].present? ? params[:department] : nil

      # organization id computation
      org_id_search = params[:organization].present? ? params[:organization] : nil

      # ratna type id computation
      ratna_type_search = params[:ratna_type].present? ? params[:ratna_type].split(',') : nil
      if !ratna_type_search.nil? && ratna_type_search.length.positive?
        ratna_type_search = ratna_type_search.map { |element| "'#{element}'" }.join(',')
      end

      # position status id computation
      position_status_search = params[:position_status].present? ? params[:position_status].split(',') : nil
      if !position_status_search.nil? && position_status_search.length.positive?
        position_status_search = position_status_search.map { |element| "'#{element}'" }.join(',')
      end

      results = []
      sql = ''
      case search_by
      when 'ministry_wise'
        sql = "
          SELECT
            ministry.id as ministry_id,
            ministry.name as ministry_name,
            SUM(CASE WHEN vac.allotment_status = 'vacant' THEN 1 ELSE 0 END) AS vacant,
            SUM(CASE WHEN vac.allotment_status = 'occupied' THEN 1 ELSE 0 END) AS occupied,
            SUM(1) AS total
          FROM public.ministries AS ministry
          LEFT JOIN public.vacancies AS vac
          ON ministry.id = vac.ministry_id
          WHERE
            vac.id IS NOT null
            AND
            vac.deleted_at IS null
        "
        sql += " AND vac.country_state_id IN (#{state_id_search})" unless state_id_search.nil?
        sql += " AND ministry.id IN (#{ministry_id_search})" unless ministry_id_search.nil?
        sql += " AND vac.allotment_status IN (#{position_status_search})" unless position_status_search.nil?
        sql += "
          GROUP BY
            ministry.id,
            ministry.name
          ORDER BY #{order_by} #{order_type}
        "
        stats = Ministry.find_by_sql(sql + " LIMIT #{limit} OFFSET #{offset};")

        stats.each do |stat|
          results << {
            ministry_id: stat.ministry_id.present? ? stat.ministry_id : nil,
            ministry_name: stat.ministry_name.present? ? stat.ministry_name : nil,
            vacant: stat.vacant.present? ? stat.vacant : nil,
            occupied: stat.occupied.present? ? stat.occupied : nil,
            total: stat.total.present? ? stat.total : nil
          }
        end
      when 'organization_wise'
        sql = "
          SELECT
            min_info.ministry_id,
            min_info.ministry_name,
            jsonb_agg(
              DISTINCT jsonb_build_object(
                'dept_id', min_info.dept_id,
                'dept_name', min_info.dept_name,
                'org_info', min_info.org_info
              )
            ) AS dept_info
          FROM (
             SELECT
                data_info.ministry_id,
                data_info.ministry_name,
                data_info.dept_id,
                data_info.dept_name,
                jsonb_agg(
                  DISTINCT jsonb_build_object(
                    'org_id', data_info.org_id,
                    'org_name', data_info.org_name,
                    'is_listed', data_info.is_listed,
                    'vacant', data_info.vacant,
                    'occupied', data_info.occupied,
                    'total', data_info.total
                  )
                ) AS org_info
             FROM (
                SELECT
                  ministry.id as ministry_id,
                  ministry.name as ministry_name,
                  dept.id as dept_id,
                  dept.name as dept_name,
                  org.id as org_id,
                  org.name as org_name,
                  org.is_listed as is_listed,
                  SUM(CASE WHEN vac.allotment_status = 'vacant' THEN 1 ELSE 0 END) AS vacant,
                  SUM(CASE WHEN vac.allotment_status = 'occupied' THEN 1 ELSE 0 END) AS occupied,
                  SUM(1) AS total
                FROM public.ministries AS ministry
                LEFT JOIN public.vacancies AS vac
                ON ministry.id = vac.ministry_id
                LEFT JOIN public.departments AS dept
                ON vac.department_id = dept.id
                LEFT JOIN public.organizations AS org
                ON vac.organization_id = org.id
                WHERE
                  vac.id IS NOT null
                  AND
                  vac.deleted_at IS null
        "
        sql += " AND vac.country_state_id IN (#{state_id_search})" unless state_id_search.nil?
        sql += " AND ministry.id IN (#{ministry_id_search})" unless ministry_id_search.nil?
        sql += " AND dept.id IN (#{dept_id_search})" unless dept_id_search.nil?
        sql += " AND org.id IN (#{org_id_search})" unless org_id_search.nil?
        sql += " AND org.ratna_type IN (#{ratna_type_search})" unless ratna_type_search.nil?
        sql += " AND vac.allotment_status IN (#{position_status_search})" unless position_status_search.nil?
        sql += "
            GROUP BY
              ministry.id,
              ministry.name,
              dept.id,
              dept.name,
              org.id,
              org.name
            ORDER BY #{order_by} #{order_type}
          ) AS data_info
          GROUP BY
            data_info.ministry_id,
            data_info.ministry_name,
            data_info.dept_id,
            data_info.dept_name
        ) AS min_info
        GROUP BY
          min_info.ministry_id,
          min_info.ministry_name
        "

        stats = Ministry.find_by_sql(sql + " LIMIT #{limit} OFFSET #{offset};")

        stats.each do |stat|
          results << {
            ministry_id: stat.ministry_id.present? ? stat.ministry_id : nil,
            ministry_name: stat.ministry_name.present? ? stat.ministry_name : nil,
            dept_info: stat.dept_info.present? ? stat.dept_info : nil
          }
        end
      when 'vacancy_wise'
        sql = "
          SELECT
            ministry.id AS ministry_id,
            ministry.name AS ministry_name,
            jsonb_agg(
              DISTINCT jsonb_build_object(
                'dept_id', dept.id,
                'dept_name', dept.name,
                'org_id', org.id,
                'org_name', org.name,
                'vac_id', vac.id,
                'designation', vac.designation,
                'status', vac.allotment_status,
                'tenure_started_at', vac.tenure_started_at,
                'tenure_ended_at', vac.tenure_ended_at
              )
            ) AS vac_info
          FROM public.ministries AS ministry
          LEFT JOIN public.vacancies AS vac
          ON ministry.id = vac.ministry_id
          LEFT JOIN public.departments AS dept
          ON vac.department_id = dept.id
          LEFT JOIN public.organizations AS org
          ON vac.organization_id = org.id
          WHERE
            vac.id IS NOT null
            AND
            vac.deleted_at IS null
        "
        sql += " AND vac.country_state_id IN (#{state_id_search})" unless state_id_search.nil?
        sql += " AND ministry.id IN (#{ministry_id_search})" unless ministry_id_search.nil?
        sql += " AND dept.id IN (#{dept_id_search})" unless dept_id_search.nil?
        sql += " AND org.id IN (#{org_id_search})" unless org_id_search.nil?
        sql += " AND org.ratna_type IN (#{ratna_type_search})" unless ratna_type_search.nil?
        sql += " AND vac.allotment_status IN (#{position_status_search})" unless position_status_search.nil?
        sql += "
          GROUP BY
            ministry.id,
            ministry.name
          ORDER BY #{order_by} #{order_type}
        "
        stats = Ministry.find_by_sql(sql + " LIMIT #{limit} OFFSET #{offset};")

        stats.each do |stat|
          results << {
            ministry_id: stat.ministry_id.present? ? stat.ministry_id : nil,
            ministry_name: stat.ministry_name.present? ? stat.ministry_name : nil,
            vac_info: stat.vac_info.present? ? stat.vac_info : nil
          }
        end
      end

      return render json: {
        success: true,
        message: 'Success',
        data: {
          value: results,
          count: Ministry.find_by_sql(sql).count
        }
      }, status: :ok
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end
end