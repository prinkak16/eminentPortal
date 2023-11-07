class Api::V1::MetadataController < BaseApiController
  # before_action :authenticate_user
  include MetadataHelper
  include FilterHelper
  include Validators::Metadata::Validator
  include UtilHelper

  def genders
    render json: {
      success: true,
      data: fetch_genders,
      message: 'Genders'
    }, status: 200
  end

  def categories
    render json: {
      success: true,
      data: fetch_categories,
      message: 'Categories'
    }, status: 200
  end

  def religions
    render json: {
      success: true,
      data: fetch_religions,
      message: 'Religions'
    }, status: 200
  end

  def educations
    render json: {
      success: true,
      data: fetch_educations,
      message: 'Education List'
    }, status: 200
  end

  def professions
    render json: {
      success: true,
      data: fetch_professions,
      message: 'Profession List'
    }, status: 200
  end

  def states
    render json: {
      success: true,
      data: fetch_states,
      message: 'State List'
    }, status: 200
  end

  def state_party_list
    cs = params[:state_id].present? ? State.find_by(id: params[:state_id]) : State.find_by(name: 'Gujarat')
    render json: {
      success: true,
      data: fetch_state_party_list(cs),
      message: 'Profession List'
    }, status: 200
  end

  def user_allotted_states
    render json: {
      success: true,
      data: fetch_user_assigned_country_states,
      message: 'User Assigned States'
    }, status: 200
  end

  def user_allotted_permissions
    render json: {
      success: true,
      data: user_permissions,
      message: 'User allotted permissions'
    }, status: 200
  end

  def required_locations
    # check validations
    params['location_id'] = params['location_id'].present? ? params['location_id'].to_i : nil
    is_param_data_is_valid = validate_form(required_locations_validator, params.as_json)
    unless is_param_data_is_valid[:is_valid]
      return render json: {
        success: false,
        message: 'Invalid request',
        error: is_param_data_is_valid[:error]
      }, status: :bad_request
    end

    return render json: {
      success: true,
      message: 'Required locations',
      data: fetch_required_locations(params['location_type'], params['location_id'], params['required_location_type'])
    }, status: :ok
  end
end