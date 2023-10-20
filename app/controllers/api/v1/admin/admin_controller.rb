class Api::V1::User::UserController < BaseApiController
  before_action :authenticate_user
  include Validators::User::Validator
  include UtilHelper
  include MinistryHelper
  include UserHelper

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
        'ministries': UserMinistry.where(user_id: params['user_id'], has_ministry: true).includes(:ministry, :user).order('created_at desc').limit(limit).offset(offset).as_json(include: [:ministry, :user]),
        'count':  UserMinistry.where(user_id: params['user_id'], has_ministry: true).count
      }
    }, status: :ok

  rescue StandardError => e
    return render json: {
      success: false,
      message: e.message
    }, status: :bad_request
  end

  def assign_ministries
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

    user = is_user_have_portal_permission(params['user_id'])
    unless user[:isExist]
      return render json: {
        success: false,
        message: 'User is not associated with our system.'
      }, status: :conflict
    end

    params['ministry_ids'].each do |ministry_id|
      UserMinistry.where(user_id: params['user_id'], ministry_id: ministry_id, has_ministry: true).first_or_create!
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

    user_ministries = UserMinistry.where(user_id: params['user_id'], ministry_id: params['ministry_ids'], has_ministry: true)
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

    user = is_user_have_portal_permission(params['user_id'])
    unless user[:isExist]
      return render json: {
        success: false,
        message: 'User is not associated with our system.'
      }, status: :conflict
    end

    params['ministry_ids'].each do |ministry_id|
      UserMinistry.where(user_id: params['user_id'], ministry_id:ministry_id, is_minister: true).first_or_create!
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

    user_ministries = UserMinistry.where(user_id: params['user_id'], ministry_id: params['ministry_ids'], is_minister: true)
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

  def user_assigned_ministries
    assigned_ministries = []

    # compute limit and offset
    limit = params[:limit].present? ? params[:limit] : 50
    offset = params[:offset].present? ? params[:offset] : 0

    sql = "SELECT
       um.user_id,
       array_remove(
         array_agg(
          CASE
            WHEN um.is_minister THEN mi.name
            ELSE null
          END
         ), null
       ) AS own_ministries,
       array_remove(
         array_agg(
          CASE
            WHEN um.has_ministry THEN mi.name
            ELSE null
          END
         ), null
       ) AS allocated_ministries,
      MAX(um.created_at) AS created_at
    FROM public.user_ministries AS um
    LEFT JOIN public.ministries AS mi
    ON um.ministry_id = mi.id
    GROUP BY um.user_id
    ORDER BY created_at DESC
    LIMIT #{limit} OFFSET #{offset};"
    user_ministries = UserMinistry.find_by_sql(sql)

    # fetch all the user ids
    user_ids = user_ministries.map { |row| row['user_id'] }

    # fetch all the user information
    user_information = fetch_user_information(user_ids)
    user_information = user_information[:user].index_by(&:user_id)

    user_ministries.each do |user_ministry|
      assigned_ministries << {
        user_id: user_ministry.user_id.present? ? user_ministry.user_id : nil,
        name: user_information[user_ministry[:user_id]].present? ? user_information[user_ministry[:user_id]].name : nil,
        allocated_ministries: user_ministry.allocated_ministries.present? ? user_ministry.allocated_ministries : [],
        own_ministries: user_ministry.own_ministries.present? ? user_ministry.own_ministries : [],
        assigned_states: user_information[user_ministry[:user_id]].present? ? user_information[user_ministry[:user_id]][:user_alloted_states] : []
      }
    end

    render json: {
      success: true,
      message: 'Success',
      data: assigned_ministries
    }, status: :ok
  end

  def minister_list
    # compute limit and offset
    limit = params[:limit].present? ? params[:limit] : 50
    offset = params[:offset].present? ? params[:offset] : 0
    name = params[:name].present? ? params[:name] : nil

    sql = "SELECT
      u.id,
      u.name,
      ARRAY(
        SELECT DISTINCT unnest(
          array_remove(
              array_agg(
                cs.name
              ), null
            )
          )
      ) AS user_alloted_states
    FROM public.users AS u
    LEFT JOIN public.user_permissions AS up
    ON u.id = up.user_id
    LEFT JOIN public.client_apps AS ca
    ON up.client_app_id = ca.id
    LEFT JOIN public.user_tag_locations AS utl
    ON up.user_tag_id = utl.user_tag_id
    LEFT JOIN public.country_states AS cs
    ON utl.location_id = cs.id
    WHERE"
    sql += " u.name LIKE '%#{name}%' AND " unless name.nil?
    sql += "ca.name = '#{ENV['CLIENT_APP_PERMISSION']}'
    AND
    up.deleted_at IS null
    AND
    utl.location_type = 'CountryState'
    GROUP BY u.id
    LIMIT #{limit} OFFSET #{offset};"

    minister_list = User.find_by_sql(sql)

    return render json: {
      success: true,
      message: 'Success',
      data: minister_list
    }, status: :ok

  rescue StandardError => e
    return render json: {
      success: false,
      message: e.message
    }, status: :bad_request
  end
end