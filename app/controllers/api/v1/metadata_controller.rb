class Api::V1::MetadataController < BaseApiController
  before_action :authenticate_user
  include MetadataHelper
  include Validators::Metadata::Validator
  include UtilHelper

  def genders
    render json: {
      success: true,
      data: [
        {
          'name': 'Male'
        },
        {
          'name': 'Female'
        },
        {
          'name': 'Others'
        }
      ],
      message: 'Genders'
    }, status: 200
  end

  def categories
    condition = "CASE person_categories.name WHEN 'GEN' THEN '1' WHEN 'OBC' THEN '2' WHEN 'SC' THEN '3' WHEN 'ST' THEN '4' WHEN 'Minority' THEN '5' else 100 END"
    result = PersonCategory.all.order(Arel.sql(condition)).select(:id, :name)
    render json: { success: true, data: result, message: 'Categories' }, status: 200
  end

  def religions
    result = Religion.select(:id, :name)
    render json: { success: true, data: result }, status: 200
  end

  def educations
    result = PersonEducation.order(:order).select(:id, :name)
    render json: { success: true, data: result, message: 'Education List' }, status: 200
  end

  def professions
    result = PersonProfession.select(:id, :name)
    render json: { success: true, data: result, message: 'Profession List' }, status: 200
  end

  def states
    result = State.select(:id, :name).order(id: :asc)
    render json: { success: true, data: result, message: 'State List' }, status: 200
  end

  def state_party_list
    cs = params[:state_id].present? ? State.find_by(id: params[:state_id]) : State.find_by(name: 'Gujarat')
    parties_list = PoliticalParty.joins(:political_party_country_states)
                                 .where(political_party_country_states: { country_state_id: cs.id })
                                 .select(:id, :name, :abbreviation)
    render json: { success: true, data: parties_list, message: 'Profession List' }, status: 200
  end

  def user_allotted_states
    render json: { success: true, data: fetch_user_assigned_country_states, message: 'User Assigned States' }, status: 200
  end

  def config_home
    result = {
      'filters': [
        get_entry_type_filter,
        get_channel_filter,
        get_age_group_filter,
        get_aasm_state_filter,
        get_qualification_filter,
        get_gender_filter,
        get_profession_filter,
        get_category_filter
      ]
    }

    render json: { success: true, data: result, message: 'Home filters.' }, status: 200
  end

  def user_allotted_permissions
    render json: { success: true, data: user_permissions, message: 'User allotted permissions' }, status: 200
  end

  def get_required_locations
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

    location_type = params['location_type']
    location_id = params['location_id']
    required_location_type = params['required_location_type']

    data = {
      'location_type': required_location_type,
      'locations': []
    }

    case location_type
    when 'State'
      case required_location_type
      when 'AssemblyConstituency'
        data[:locations] = AssemblyConstituency.where(country_state_id: location_id).select("CONCAT(number, ' - ',name) AS name, id AS id").order(number: :asc)
      when 'ParliamentaryConstituency'
        data[:locations] = ParliamentaryConstituency.where(country_state_id: location_id).select("CONCAT(number, ' - ',name) AS name, id AS id").order(number: :asc)
      when 'AdministrativeDistrict'
        data[:locations] = AdministrativeDistrict.where(country_state_id: location_id).select("name, id").order(name: :asc)
      end
    end

    return render json: {
      success: true,
      message: 'Required locations',
      data: data
    }, status: :ok
  end

  def config_gom_management
    minister_name = params[:minister_name].present? ? params[:minister_name] : ''
    ministry_name = params[:ministry_name].present? ? params[:ministry_name] : ''

    result = {
      'filters': [
        get_minister_filters(minister_name),
        get_ministry_filters(ministry_name)
      ]
    }

    render json: { success: true, data: result, message: 'GOM filters.' }, status: 200
  end
end