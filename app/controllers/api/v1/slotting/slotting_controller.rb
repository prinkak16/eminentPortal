class Api::V1::Slotting::SlottingController < BaseApiController
  before_action :authenticate_user
  include CustomMemberFormHelper
  include UtilHelper
  include MetadataHelper
  include Validators::Slotting::Validator

  def position_analytics
    begin
      unless is_permissible?('Slotting', 'View')
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      stats = {
        'total': 0,
        'slotted': 0,
        'unslotted': 0
      }
      sql = "
        SELECT
           SUM(CASE WHEN vac.slotting_status IN ('unslotted') THEN 1 ELSE 0 END) AS unslotted,
           SUM(CASE WHEN vac.slotting_status IN ('slotted', 'outside_saral') THEN 1 ELSE 0 END) AS slotted,
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
           vac.allotment_status = 'vacant'
           AND
           um.user_id = #{current_user.id}
      "
      results = Vacancy.find_by_sql(sql)

      if results.present? && results[0].present?
        stats[:total] = results[0]['total'] || 0
        stats[:slotted] = results[0]['slotted'] || 0
        stats[:unslotted] = results[0]['unslotted'] || 0
      end
      return render json: { success: true, message: 'Success', data: stats }, status: :ok
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def list
    begin
      unless is_permissible?('Slotting', 'View')
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      # compute limit and offset
      limit = params[:limit].present? ? params[:limit] : 10
      offset = params[:offset].present? ? params[:offset] : 0

      # compute order by
      order_by = params[:order_by].present? ? params[:order_by] : 'ministry_name'
      unless ['ministry_name', 'dept_name', 'org_name', 'is_listed', 'vacant', 'is_slotted', 'total'].include?(order_by)
        return render json: {
          success: false,
          message: 'Invalid order by, allowed types are(ministry_name, dept_name, org_name, is_listed, vacant, is_slotted, total).'
        }, status: :bad_request
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
      sql = "
        SELECT
          ministry.id AS ministry_id,
          ministry.name AS ministry_name,
          org.id AS org_id,
          org.name AS org_name,
          org.is_listed AS is_listed,
          SUM(1) AS total,
          SUM(CASE WHEN vac.slotting_status IN ('unslotted') THEN 1 ELSE 0 END) AS unslotted,
          SUM(CASE WHEN vac.slotting_status IN ('slotted', 'outside_saral') THEN 1 ELSE 0 END) AS slotted,
          SUM(CASE WHEN vac.allotment_status = 'vacant' THEN 1 ELSE 0 END) AS vacant,
          SUM(CASE WHEN vac.allotment_status = 'occupied' THEN 1 ELSE 0 END) AS occupied,
          MAX(vac.updated_at) AS last_updated_at
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
          vac.allotment_status = 'vacant'
          AND
          um.user_id = #{current_user.id}
      "
      sql += " AND vac.country_state_id IN (#{state_id_search})" unless state_id_search.nil?
      sql += " AND ministry.id IN (#{ministry_id_search})" unless ministry_id_search.nil?
      sql += " AND dept.id IN (#{dept_id_search})" unless dept_id_search.nil?
      sql += " AND org.id IN (#{org_id_search})" unless org_id_search.nil?
      sql += " AND org.ratna_type IN (#{ratna_type_search})" unless ratna_type_search.nil?
      sql += " AND vac.status IN (#{position_status_search})" unless position_status_search.nil?
      sql += "
        GROUP BY
          ministry.id,
          ministry.name,
          org.id,
          org.name
        ORDER BY #{order_by} #{order_type}
      "
      stats = UserMinistry.find_by_sql(sql + " LIMIT #{limit} OFFSET #{offset};")

      stats.each do |stat|
        results << {
          ministry_id: stat.ministry_id.present? ? stat.ministry_id : nil,
          ministry_name: stat.ministry_name.present? ? stat.ministry_name : nil,
          org_id: stat.org_id.present? ? stat.org_id : nil,
          org_name: stat.org_name.present? ? stat.org_name : nil,
          is_listed: stat.is_listed.present? ? stat.is_listed : nil,
          total: stat.total.present? ? stat.total : 0,
          slotted: stat.slotted.present? ? stat.slotted : 0,
          unslotted: stat.unslotted.present? ? stat.unslotted : 0,
          vacant: stat.vacant.present? ? stat.vacant : 0,
          occupied: stat.occupied.present? ? stat.occupied : 0,
          last_updated_at: stat.last_updated_at.present? ? stat.last_updated_at : nil
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

  def slot
    begin
      permission_exist = is_permissible('Eminent', 'Slotting')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      # check validations
      is_param_data_is_valid = validate_form(slotting_validation, params.as_json)
      unless is_param_data_is_valid[:is_valid]
        return render json: {
          success: false,
          message: 'Invalid request',
          error: is_param_data_is_valid[:error]
        }, status: :bad_request
      end

      # check if vacancy count available for slotting
      vacancies = Vacancy.where(ministry_id: params[:ministry_id])
                         .where(organization_id: params[:organization_id])
                         .where(slotting_status: 'unslotted')
                         .where.not(allotment_status: 'occupied')


      vacancies_count = vacancies.length
      if params[:vacancy_count] > vacancies_count
        return render json: {
          success: false,
          message: "Vacancy count(#{params[:vacancy_count]}) are not available for slotting."
        }, status: :bad_request
      end
      vacancy_details = vacancies.take(params[:vacancy_count])

      # check if state exist
      cs_detail = CountryState.find_by(id: params[:state_id])
      if cs_detail.nil?
        return render json: {
          success: false,
          message: 'Invalid state provided for slotting.'
        }, status: :bad_request
      end

      vacancy_details.each do |vacancy_detail|
        if vacancy_detail.may_slot?
          vacancy_detail.update(
            country_state_id: params[:state_id],
            slotting_remarks: params[:remarks]
          )
          vacancy_detail.slot!
        end
      end

      return render json: { success: true, message: "#{vacancy_details.count} vacancies are slotted to #{cs_detail.name} successfully." }, status: :ok
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def unslot
    begin
      permission_exist = is_permissible('Eminent', 'Slotting')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      # check validations
      is_param_data_is_valid = validate_form(unslotting_validation, params.as_json)
      unless is_param_data_is_valid[:is_valid]
        return render json: {
          success: false,
          message: 'Invalid request',
          error: is_param_data_is_valid[:error]
        }, status: :bad_request
      end

      # check if vacancy count available for unslotting
      vacancies = Vacancy.where(id: params[:vacancies_id])

      vacancies_count = vacancies.length
      if vacancies_count < 1
        return render json: {
          success: false,
          message: 'No vacancy are available for unslotting.'
        }, status: :bad_request
      end

      raise "Vacancies are occupied, so can't be unslotted" if vacancies.where(allotment_status: 'occupied').present?

      vacancies.each do |vacancy|
        if vacancy.may_unslot?
          vacancy.unslot!
        end
      end

      return render json: { success: true, message: 'Vacancies are unslotted successfully.' }, status: :ok
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def reslot
    begin
      permission_exist = is_permissible('Eminent', 'Slotting')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      # check validations
      is_param_data_is_valid = validate_form(reslotting_validation, params.as_json)
      unless is_param_data_is_valid[:is_valid]
        return render json: {
          success: false,
          message: 'Invalid request',
          error: is_param_data_is_valid[:error]
        }, status: :bad_request
      end

      # unslot the existing vacancy
      # check if vacancy count available for unslotting
      vacancies = Vacancy.where(id: params[:vacancies_id])
                         .where.not(allotment_status: 'occupied')

      vacancies_count = vacancies.length
      if vacancies_count < 1
        return render json: {
          success: false,
          message: "Vacancy count(#{params[:vacancy_count]}) are not available for reslotting."
        }, status: :bad_request
      end

      # unslot all the provided vacancy
      vacancies.each do |vacancy|
        if vacancy.may_unslot?
          vacancy.unslot!
        end
      end

      # slot the existing vacancy
      # check if vacancy count available for slotting
      vacancies = Vacancy.where(ministry_id: params[:ministry_id])
                         .where(organization_id: params[:organization_id])
                         .where(slotting_status: 'unslotted')
                         .where.not(allotment_status: 'occupied')


      vacancies_count = vacancies.length
      if params[:vacancy_count] > vacancies_count
        return render json: {
          success: false,
          message: "Vacancy count(#{params[:vacancy_count]}) are not available for reslotting."
        }, status: :bad_request
      end
      vacancy_details = vacancies.take(params[:vacancy_count])

      # check if state exist
      cs_detail = CountryState.find_by(id: params[:state_id])
      if cs_detail.nil?
        return render json: {
          success: false,
          message: 'Invalid state provided for slotting.'
        }, status: :bad_request
      end

      vacancy_details.each do |vacancy_detail|
        if vacancy_detail.may_slot?
          vacancy_detail.update(
            country_state_id: params[:state_id],
            slotting_remarks: params[:remarks]
          )
          vacancy_detail.slot!
        end
      end

      return render json: { success: true, message: "#{vacancy_details.count} vacancies are reslotted to #{cs_detail.name} successfully." }, status: :ok
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def stats
    begin
      permission_exist = is_permissible('Eminent', 'Slotting')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      # fetch the country states
      country_states = CountryState.all
      country_state_details = country_states.map { |record| [record.id, record.name] }.to_h

      # compute limit and offset
      limit = params[:limit].present? ? params[:limit] : 10
      offset = params[:offset].present? ? params[:offset] : 0

      # check validations
      params['organization_id'] = params['organization_id'].to_i
      is_param_data_is_valid = validate_form(slotting_organization_stats_validation, params.as_json)
      unless is_param_data_is_valid[:is_valid]
        return render json: {
          success: false,
          message: 'Invalid request',
          error: is_param_data_is_valid[:error]
        }, status: :bad_request
      end

      results = []
      sql = "
        SELECT
          count(*) AS vacancy_count,
          country_state_id,
          slotting_remarks,
          JSON_AGG(vac.id) as vacancies_id
        FROM  public.user_ministries AS um
        LEFT JOIN public.vacancies AS vac
        ON um.ministry_id = vac.ministry_id
        WHERE
          vac.id IS NOT null
          AND
          vac.deleted_at IS null
          AND
          vac.organization_id = #{params['organization_id']}
          AND
          vac.country_state_id IS NOT null
          AND
          vac.allotment_status = 'vacant'
          AND
          um.user_id = #{current_user.id}
        GROUP BY country_state_id, slotting_remarks
      "
      stats = UserMinistry.find_by_sql(sql + " LIMIT #{limit} OFFSET #{offset};")

      stats.each do |stat|
        results << {
          vacancy_count: stat.vacancy_count.present? ? stat.vacancy_count : 0,
          country_state_id: stat.country_state_id.present? ? stat.country_state_id : 0,
          country_state_name: stat.country_state_id.present? ? country_state_details[stat.country_state_id] : '',
          slotting_remarks: stat.slotting_remarks.present? ? stat.slotting_remarks : '',
          vacancies_id: stat.vacancies_id.present? ? stat.vacancies_id : 0
        }
      end

      sql_org_stats = "
        SELECT
          org.id,
          org.name,
          SUM(1) AS total,
            SUM(CASE WHEN vac.slotting_status IN ('unslotted') THEN 1 ELSE 0 END) AS unslotted,
            SUM(CASE WHEN vac.slotting_status IN ('slotted', 'outside_saral') THEN 1 ELSE 0 END) AS slotted,
            SUM(CASE WHEN vac.allotment_status = 'vacant' THEN 1 ELSE 0 END) AS vacant,
            SUM(CASE WHEN vac.allotment_status = 'occupied' THEN 1 ELSE 0 END) AS occupied
        FROM  public.user_ministries AS um
        LEFT JOIN public.vacancies AS vac
        ON um.ministry_id = vac.ministry_id
        LEFT JOIN public.organizations AS org
        ON vac.organization_id = org.id
        WHERE
          vac.id IS NOT null
          AND
          vac.deleted_at IS null
          AND
          vac.allotment_status = 'vacant'
          AND
          vac.organization_id = #{params['organization_id']}
          AND
          um.user_id = #{current_user.id}
        GROUP BY org.name, org.id
      "

      return render json: {
        success: true,
        message: 'Success',
        data: {
          stats: UserMinistry.find_by_sql(sql_org_stats),
          slotting: {
            value: results,
            count: UserMinistry.find_by_sql(sql).count
          }
        }
      }, status: :ok
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end
end