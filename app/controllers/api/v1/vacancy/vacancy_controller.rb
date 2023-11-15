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
      state_ids = [1]
      fetch_user_assigned_country_states.each do |country_state|
        state_ids << country_state['id']
      end

      return render json: { success: true, message: 'Success', data: stats }, status: :ok unless state_ids.size.positive?

      results = Vacancy.select(
        "SUM(CASE WHEN status = 'VACANT' THEN 1 ELSE 0 END) AS vacant",
        "SUM(CASE WHEN status = 'OCCUPIED' THEN 1 ELSE 0 END) AS occupied",
        "SUM(1) AS total"
      ).find_by(country_state_id: state_ids)

      unless results.nil?
        stats[:total] = results['total'] if results['total'].present?
        stats[:occupied] = results['occupied'] if results['occupied'].present?
        stats[:vacant] = results['vacant'] if results['vacant'].present?
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

      stats = []

      state_details = {}
      state_ids = []
      fetch_user_assigned_country_states.each do |country_state|
        state_ids << country_state['id']
        state_details[country_state['id']] = country_state['name']
      end

      return render json: { success: true, message: 'Success', data: stats }, status: :ok unless state_ids.size.positive?

      results = Vacancy
        .select('COUNT(*) AS vacant, country_state_id AS cs_id')
        .where(status: 'VACANT')
        .group('country_state_id')
        .order('country_state_id ASC')

      results.each do |result|
        stats << {
          count: result['vacant'],
          cs_id: result['cs_id'],
          cs_name: state_details[result['cs_id']].present? ? state_details[result['cs_id']] : nil
        }
      end

      return render json: { success: true, message: 'Success', data: stats }, status: :ok
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def list_ministry_wise
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
      state_ids = params[:country_state_id].present? ? params[:country_state_id].split(',') : nil
      if state_ids.nil?
        state_ids = []
        fetch_user_assigned_country_states.each do |country_state|
          state_ids << country_state['id']
        end
      end
      state_id_search = state_ids.length.positive? ? state_ids.join(',') : nil

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
            SUM(CASE WHEN vac.status = 'VACANT' THEN 1 ELSE 0 END) AS vacant,
            SUM(CASE WHEN vac.status = 'OCCUPIED' THEN 1 ELSE 0 END) AS occupied,
            SUM(1) AS total
          FROM public.user_ministries AS um
          LEFT JOIN public.ministries AS ministry
          ON um.ministry_id = ministry.id
          LEFT JOIN public.departments AS dept
          ON ministry.id = dept.ministry_id
          LEFT JOIN public.organizations AS org
          ON dept.id = org.department_id
          LEFT JOIN public.vacancies AS vac
          ON ministry.id = vac.ministry_id
          WHERE
            um.is_minister IS false
            AND
            um.user_id = #{current_user.id}
            AND
            org.country_state_id IN (#{state_id_search})
        "
        sql += " AND ministry.id IN (#{ministry_id_search})" unless ministry_id_search.nil?
        sql += " AND dept.id IN (#{dept_id_search})" unless dept_id_search.nil?
        sql += " AND org.id IN (#{org_id_search})" unless org_id_search.nil?
        sql += " AND org.ratna_type IN (#{ratna_type_search})" unless ratna_type_search.nil?
        sql += " AND vac.status IN (#{position_status_search})" unless position_status_search.nil?
        sql += "
          GROUP BY
            ministry.id,
            ministry.name
          ORDER BY #{order_by} #{order_type}
        "
        stats = UserMinistry.find_by_sql(sql + " LIMIT #{limit} OFFSET #{offset};")

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
            ministry.id as ministry_id,
            ministry.name as ministry_name,
            dept.id as dept_id,
            dept.name as dept_name,
            org.id as org_id,
            org.name as org_name,
            org.is_listed as is_listed,
            SUM(CASE WHEN vac.status = 'VACANT' THEN 1 ELSE 0 END) AS vacant,
            SUM(CASE WHEN vac.status = 'OCCUPIED' THEN 1 ELSE 0 END) AS occupied,
            SUM(1) AS total
          FROM public.user_ministries AS um
          LEFT JOIN public.ministries AS ministry
          ON um.ministry_id = ministry.id
          LEFT JOIN public.departments AS dept
          ON ministry.id = dept.ministry_id
          LEFT JOIN public.organizations AS org
          ON dept.id = org.department_id
          LEFT JOIN public.vacancies AS vac
          ON ministry.id = vac.ministry_id
          WHERE
            um.is_minister IS false
            AND
            um.user_id = #{current_user.id}
            AND
            org.country_state_id IN (#{state_id_search})
        "
        sql += " AND ministry.id IN (#{ministry_id_search})" unless ministry_id_search.nil?
        sql += " AND dept.id IN (#{dept_id_search})" unless dept_id_search.nil?
        sql += " AND org.id IN (#{org_id_search})" unless org_id_search.nil?
        sql += " AND org.ratna_type IN (#{ratna_type_search})" unless ratna_type_search.nil?
        sql += " AND vac.status IN (#{position_status_search})" unless position_status_search.nil?
        sql += "
          GROUP BY
            ministry.id,
            ministry.name,
            dept.id,
            dept.name,
            org.id,
            org.name,
            org.is_listed
          ORDER BY #{order_by} #{order_type}
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
            vacant: stat.vacant.present? ? stat.vacant : nil,
            occupied: stat.occupied.present? ? stat.occupied : nil,
            total: stat.total.present? ? stat.total : nil
          }
        end
      when 'vacancy_wise'
        sql = "
          SELECT
            ministry.id as ministry_id,
            ministry.name as ministry_name,
            dept.id as dept_id,
            dept.name as dept_name,
            org.id as org_id,
            org.name as org_name,
            vac.id as vac_id,
            vac.designation,
            vac.status,
            vac.tenure_started_at,
            vac.tenure_ended_at
          FROM public.user_ministries AS um
          LEFT JOIN public.ministries AS ministry
          ON um.ministry_id = ministry.id
          LEFT JOIN public.departments AS dept
          ON ministry.id = dept.ministry_id
          LEFT JOIN public.organizations AS org
          ON dept.id = org.department_id
          LEFT JOIN public.vacancies AS vac
          ON ministry.id = vac.ministry_id
          WHERE
            um.is_minister IS false
            AND
            um.user_id = #{current_user.id}
            AND
            org.country_state_id IN (#{state_id_search})
            AND
            vac.deleted_at IS null
        "
        sql += " AND ministry.id IN (#{ministry_id_search})" unless ministry_id_search.nil?
        sql += " AND dept.id IN (#{dept_id_search})" unless dept_id_search.nil?
        sql += " AND org.id IN (#{org_id_search})" unless org_id_search.nil?
        sql += " AND org.ratna_type IN (#{ratna_type_search})" unless ratna_type_search.nil?
        sql += " AND vac.status IN (#{position_status_search})" unless position_status_search.nil?
        sql += "
          GROUP BY
            ministry.id,
            ministry.name,
            dept.id,
            dept.name,
            org.id,
            org.name,
            org.is_listed,
            vac.id,
            vac.designation,
            vac.status,
            vac.tenure_started_at,
            vac.tenure_ended_at
          ORDER BY #{order_by} #{order_type}
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
            vac_id: stat.vac_id.present? ? stat.vac_id : nil,
            designation: stat.designation.present? ? stat.designation : nil,
            status: stat.status.present? ? stat.status : nil,
            tenure_started_at: stat.tenure_started_at.present? ? stat.tenure_started_at : nil,
            tenure_ended_at: stat.tenure_ended_at.present? ? stat.tenure_ended_at : nil
          }
        end
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