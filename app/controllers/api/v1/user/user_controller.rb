class Api::V1::User::UserController < BaseApiController
  before_action :authenticate_user
  include Validators::User::Validator
  include UtilHelper
  include MinistryHelper
  include UserHelper
  include MailHelper

  def assigned_ministries
    # check validations
    params['user_id'] = params['user_id'].to_i
    is_param_data_is_valid = validate_form(assigned_ministry_validator, params.as_json)
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
        'ministries': UserMinistry.where(user_id: params['user_id'], is_minister: false).includes(:ministry, :user).order('created_at desc').limit(limit).offset(offset).as_json(include: [:ministry, :user]),
        'count': UserMinistry.where(user_id: params['user_id'], is_minister: false).count
      }
    }, status: :ok

  rescue StandardError => e
    return render json: {
      success: false,
      message: e.message
    }, status: :bad_request
  end

  def assign_ministries
    begin
      # check validations
      params['user_id'] = params['user_id'].to_i
      is_param_data_is_valid = validate_form(user_ministry_validator, params.as_json)
      unless is_param_data_is_valid[:is_valid]
        return render json: {
          success: false,
          message: 'Invalid request',
          error: is_param_data_is_valid[:error]
        }, status: :bad_request
      end

      input_ministry_count = params['ministry_ids'].length
      ministry = Ministry.where(id: params['ministry_ids'])
      if input_ministry_count != ministry.count
        return render json: {
          success: false,
          message: 'Some of the ministry is not associated with our system.'
        }, status: :conflict
      end

      auth_user = AuthUser.find_by(id: params['user_id'])
      if auth_user.nil?
        return render json: {
          success: false,
          message: 'Minister/PA/Assistant is not associated with our system.'
        }, status: :unauthorized
      end

      params['ministry_ids'].each do |ministry_id_v|
        UserMinistry.where(
          user_id: params['user_id'],
          ministry_id: ministry_id_v,
          is_minister: false
        ).first_or_create!
      end

      return render json: {
        success: true,
        message: 'Success'
      }, status: :ok
    rescue StandardError => e
      return render json: {
        success: false,
        message: e.message
      }, status: :bad_request
    end
  end

  def dissociate_ministries
    # check validations
    params['user_id'] = params['user_id'].to_i
    is_param_data_is_valid = validate_form(user_ministry_validator, params.as_json)
    unless is_param_data_is_valid[:is_valid]
      return render json: {
        success: false,
        message: 'Invalid request',
        error: is_param_data_is_valid[:error]
      }, status: :bad_request
    end

    user_ministries = UserMinistry.where(
      user_id: params['user_id'],
      ministry_id: params['ministry_ids'],
      is_minister: false
    )
    if user_ministries.count != params['ministry_ids'].length
      return render json: {
        success: false,
        message: 'Some of the ministry and user are not associated in our system.'
      }, status: :conflict
    end
    user_ministries.destroy_all

    return render json: {
      success: true,
      message: 'Success'
    }, status: :ok
  rescue StandardError => e
    return render json: {
      success: false,
      message: e.message
    }, status: :bad_request
  end

  def allocated_ministries
    # check validations
    params['user_id'] = params['user_id'].to_i
    is_param_data_is_valid = validate_form(
      assigned_ministry_validator,
      params.as_json
    )
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
        'ministries': UserMinistry.where(user_id: params['user_id'], is_minister: true).includes(:ministry, :user).order('created_at desc').limit(limit).offset(offset).as_json(include: [:ministry, :user]),
        'count':  UserMinistry.where(user_id: params['user_id'], is_minister: true).count
      }
    }, status: :ok

  rescue StandardError => e
    return render json: {
      success: false,
      message: e.message
    }, status: :bad_request
  end

  def allocate_ministries
    # check validations
    params['user_id'] = params['user_id'].to_i
    is_param_data_is_valid = validate_form(
      user_ministry_validator,
      params.as_json
    )
    unless is_param_data_is_valid[:is_valid]
      return render json: {
        success: false,
        message: 'Invalid request',
        error: is_param_data_is_valid[:error]
      }, status: :bad_request
    end
    input_ministry_count = params['ministry_ids'].length
    ministry = Ministry.where(
      id: params['ministry_ids']
    )
    if input_ministry_count != ministry.count
      return render json: {
        success: false,
        message: 'Some of the ministry is not associated with our system.'
      }, status: :conflict
    end

    auth_user = AuthUser.find_by(
      id: params['user_id'],
      assist_to_id: nil
    )
    if auth_user.nil?
      return render json: {
        success: false,
        message: 'Minister/PA/Assistant is not associated with our system.'
      }, status: :unauthorized
    end

    params['ministry_ids'].each do |ministry_id_v|
      UserMinistry.where(
        user_id: params['user_id'],
        ministry_id: ministry_id_v,
        is_minister: true
      ).first_or_create!
    end

    return render json: {
      success: true,
      message: 'Success'
    }, status: :ok
  rescue StandardError => e
    return render json: {
      success: false,
      message: e.message
    }, status: :bad_request
  end

  def deallocate_ministries
    # check validations
    params['user_id'] = params['user_id'].to_i
    is_param_data_is_valid = validate_form(user_ministry_validator, params.as_json)
    unless is_param_data_is_valid[:is_valid]
      return render json: {
        success: false,
        message: 'Invalid request',
        error: is_param_data_is_valid[:error]
      }, status: :bad_request
    end

    user_ministries = UserMinistry.where(
      user_id: params['user_id'],
      ministry_id: params['ministry_ids'],
      is_minister: true
    )
    if user_ministries.count != params['ministry_ids'].length
      return render json: {
        success: false,
        message: 'Some of the ministry are not allocated to user in our system.'
      }, status: :conflict
    end
    user_ministries.destroy_all

    return render json: {
      success: true,
      message: 'Success'
    }, status: :ok
  rescue StandardError => e
    return render json: {
      success: false,
      message: e.message
    }, status: :bad_request
  end
end