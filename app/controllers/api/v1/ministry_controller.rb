class Api::V1::MinistryController < ApplicationController
  before_action :authenticate_user
  skip_before_action :verify_authenticity_token
  include Validators::Ministry::Validator
  include UtilHelper

  def get_ministry
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

      ministry = Ministry.find_by_id(params[:ministry_id])

      render json: {
        success: true,
        message: 'Success',
        data: {
          'ministry': ministry,
          'isExist': !ministry.nil?
        }
      }, status: :ok
    rescue StandardError => e
      return render json: {
        success: false,
        message: e.message
      }, status: :bad_request
    end
  end

  def get_ministries
    begin
      # compute limit and offset
      limit = params[:limit].present? ? params[:limit] : 50
      offset = params[:offset].present? ? params[:offset] : 0

      render json: {
        success: true,
        message: 'Success',
        data: {
          'ministries': Ministry.order('created_at desc').limit(limit).offset(offset),
          'count': Ministry.unscoped.count
        }
      }, status: :ok
    rescue StandardError => e
      return render json: {
        success: false,
        message: e.message
      }, status: :bad_request
    end
  end

  def add_ministry
    begin
      # check validations
      is_param_data_is_valid = validate_form(add_ministry_validation, params.as_json)
      unless is_param_data_is_valid[:is_valid]
        return render json: {
          success: false,
          message: 'Invalid request',
          error: is_param_data_is_valid[:error]
        }, status: :bad_request
      end

      ministry_slug = convert_to_snake_case(params[:name])
      ministry_exist = Ministry.where(slug: ministry_slug).exists?
      if ministry_exist
        return render json: {
          success: false,
          message: 'Ministry name already associated with our system.'
        }, status: :conflict
      end

      ministry = Ministry.create!(
        name: params['name'],
        slug: ministry_slug
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