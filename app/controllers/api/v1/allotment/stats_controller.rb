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
      return render json: { success: true, message: 'Success', data: stats }, status: :ok

    rescue StandardError => e
      return render json: {
        success: false,
        message: e.message
      }, status: :bad_request
    end
  end

  def list
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

  end
end