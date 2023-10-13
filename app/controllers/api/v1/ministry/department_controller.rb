class Api::V1::Ministry::DepartmentController < ApplicationController
  before_action :authenticate_user
  skip_before_action :verify_authenticity_token
  include Validators::Ministry::Department::Validator
  include Validators::Ministry::Validator
  include UtilHelper
  include MinistryHelper

  def get_department
    begin
      # check validations
      params['ministry_id'] = params['ministry_id'].to_i
      params['department_id'] = params['department_id'].to_i
      is_param_data_is_valid = validate_form(get_ministry_department_validation, params.as_json)
      unless is_param_data_is_valid[:is_valid]
        return render json: {
          success: false,
          message: 'Invalid request',
          error: is_param_data_is_valid[:error]
        }, status: :bad_request
      end

      # fetch the of ministry department
      department = Department.includes(:ministry).where(id: params['department_id'], ministry_id: params['ministry_id']).as_json(include: [:ministry])

      return render json: {
        success: true,
        message: 'Success',
        data: {
          'department': department,
          'isExist': !department.nil?
        }
      }, status: :ok
    rescue StandardError => e
      return render json: {
        success: false,
        message: e.message
      }, status: :bad_request
    end
  end

  def get_departments
    begin
      # check validations
      params['ministry_id'] = params['ministry_id'].to_i
      is_param_data_is_valid = validate_form(get_ministry_validation, params.as_json)
      unless is_param_data_is_valid[:is_valid]
        return render json: {
          success: false,
          message: 'Invalid request',
          error: is_param_data_is_valid[:error]
        }, status: :bad_request
      end

      # compute limit and offset
      limit = params[:limit].present? ? params[:limit] : 50
      offset = params[:offset].present? ? params[:offset] : 0

      render json: {
        success: true,
        message: 'Success',
        data: {
          'ministries': Department.where(ministry_id: params['ministry_id']).includes(:ministry).order('created_at desc').limit(limit).offset(offset).as_json(include: [:ministry]),
          'count': Department.where(ministry_id: params['ministry_id']).count
        }
      }, status: :ok
    rescue StandardError => e
      return render json: {
        success: false,
        message: e.message
      }, status: :bad_request
    end
  end

  def add_department
    begin
      # check validations
      params['ministry_id'] = params['ministry_id'].to_i
      is_param_data_is_valid = validate_form(add_department_validation, params.as_json)
      unless is_param_data_is_valid[:is_valid]
        return render json: {
          success: false,
          message: 'Invalid request',
          error: is_param_data_is_valid[:error]
        }, status: :bad_request
      end

      ministry = fetch_ministry_by_id(params['ministry_id'])
      if ministry.nil?
        return render json: {
          success: false,
          message: 'Ministry is not associated with our system.'
        }, status: :conflict
      end

      department_slug = convert_to_snake_case(params[:name])
      department_exist = Department.where(ministry_id: params['ministry_id'], slug: department_slug).exists?

      if department_exist
        return render json: {
          success: false,
          message: 'Ministry department already associated with our system.'
        }, status: :conflict
      end

      ministry = Department.create!(
        ministry_id: params['ministry_id'],
        name: params['name'],
        slug: department_slug
      )
      return render json: {
        success: true,
        message: 'Ministry Saved successfully'
      }, status: :ok
    rescue StandardError => e
      return render json: {
        success: false,
        message: e.message
      }, status: :bad_request
    end
  end
end