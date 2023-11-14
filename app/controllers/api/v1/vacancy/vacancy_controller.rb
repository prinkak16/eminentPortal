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


      return render json: { success: true, message: 'Success', data: stats }, status: :ok
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end
end