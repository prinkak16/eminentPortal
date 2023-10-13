class Api::V1::Ministry::Department::OrganizationController < BaseApiController
  before_action :authenticate_user
  include Validators::Ministry::Department::Organization::Validator
  include Validators::Ministry::Department::Validator
  include Validators::Ministry::Validator
  include UtilHelper
  include MinistryHelper
  include DepartmentHelper
  include OrganizationHelper

  def add_organization
    begin
      # check validations
      params['ministry_id'] = params['ministry_id'].to_i
      params['department_id'] = params['department_id'].to_i
      is_param_data_is_valid = validate_form(add_organization_validation, params.as_json)
      unless is_param_data_is_valid[:is_valid]
        return render json: {
          success: false,
          message: 'Invalid request',
          error: is_param_data_is_valid[:error]
        }, status: :bad_request
      end

      # check if country state id exist
      cs_id = params['country_state_id'].present? ? params['country_state_id'].to_i : nil
      unless cs_id.nil?
        if CountryState.find_by_id(cs_id).nil?
          return render json: {
            success: false,
            message: 'State is not associated with our system.'
          }, status: :conflict
        end
      end

      # check if department exist
      department = fetch_ministry_department_by_id(params['ministry_id'], params['department_id'])
      if department.nil?
        return render json: {
          success: false,
          message: 'Department is not associated with our system.'
        }, status: :conflict
      end

      # check if parent organization exist
      p_id = params['parent_id'].present? ? params['parent_id'] : nil
      unless p_id.nil?
        if fetch_organization_by_id(p_id).nil?
          return render json: {
            success: false,
            message: 'Organization is not associated with our system.'
          }, status: :conflict
        end
      end

      # check if organization exist
      organization_slug = convert_to_snake_case(params[:name])
      organization_exist = Organization.where(
        ministry_id: params['ministry_id'],
        department_id: params['department_id'],
        slug: organization_slug
      ).exists?

      if organization_exist
        return render json: {
          success: false,
          message: 'Organization already associated with our system.'
        }, status: :conflict
      end

      Organization.create!(
        parent_id: p_id,
        country_state_id: cs_id,
        ministry_id: params['ministry_id'],
        department_id: params['department_id'],
        name: params['name'],
        type: params['type'].present? ? params['type'] : nil,
        ratna_type: params['ratna_type'].present? ? params['ratna_type'] : nil,
        is_listed: params['is_listed'].present? ? params['is_listed'] : false,
        slug: organization_slug,
        abbreviation: params['abbreviation'].present? ? params['abbreviation'] : nil,
        location: params['location'].present? ? params['location'] : '{}'
      )
      return render json: {
        success: true,
        message: 'Organization saved successfully'
      }, status: :ok
    rescue StandardError => e
      return render json: {
        success: false,
        message: e.message
      }, status: :bad_request
    end
  end
end