class Api::V1::StatsController < BaseApiController
  before_action :authenticate_user
  include CustomMemberFormHelper
  include UtilHelper

  def home
    begin
      permission_exist = is_permissible('Eminent', 'Home')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end
      stats = {
        'overall': 0,
        'completed': 0,
        'incomplete': 0
      }
      state_ids = []
      fetch_user_assigned_country_states.each do |country_state|
        state_ids << country_state['id']
      end

      return render json: { success: true, message: 'Success', data: stats }, status: :ok unless state_ids.size.positive?

      results = CustomMemberForm.select(
        "SUM(CASE WHEN aasm_state IN ('pending', 'incomplete', 'otp_verified') THEN 1 ELSE 0 END) AS incomplete",
        "SUM(CASE WHEN aasm_state IN ('submitted', 'approved', 'rejected') THEN 1 ELSE 0 END) AS completed",
        "SUM(1) AS overall"
      ).find_by(country_state_id: state_ids)

      unless results.nil?
        stats[:overall] = results['overall'] if results['overall'].present?
        stats[:completed] = results['completed'] if results['completed'].present?
        stats[:incomplete] = results['incomplete'] if results['incomplete'].present?
      end
      return render json: { success: true, message: 'Success', data: stats }, status: :ok
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end
end