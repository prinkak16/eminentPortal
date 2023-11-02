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
    begin
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

  def upload_minister_assistant_mapping
    begin
      permission_exist = is_permissible('GOMManagement', 'MinisterAssistantMapping')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :bad_request
      end

      p_regex = phone_regex
      upload_user_result = []

      # check if email not exist
      email = params[:email].present? ? params[:email] : nil
      if email.nil?
        return render json: {
          success: false,
          message: 'Please provide a valid email for notification.'
        }, status: :bad_request
      end

      # check if file not exist
      file = params[:file].present? ? params[:file] : nil
      if file.nil? || file.content_type != 'text/csv'
        return render json: {
          success: false,
          message: 'Please provide a valid csv file.'
        }, status: :bad_request
      end

      begin
        puts 'trying with UTF-8'
        file = open(file.path)
        file.set_encoding(Encoding.find('UTF-8'))
        rows = CSV.parse(file.read, header_converters: lambda { |name| name.gsub(/\ufeff/, '') }, headers: true, :quote_char => '"')
      rescue StandardError => e
        puts 'trying with ISO'
        file = open(file.path)
        file.set_encoding(Encoding.find('ISO-8859-1'))
        rows = CSV.parse(file.read, header_converters: lambda { |name| name.gsub(/\ufeff/, '') }, headers: true, :quote_char => '"')
      end

      # check if file is valid or not
      unless rows.length.positive?
        return render json: {
          success: false,
          message: 'Please provide a valid csv file.'
        }, status: :bad_request
      end

      rows.each do |row|
        user_number = row[0]
        assist_to_number = row[1]
        row_data = {
          minister_number: user_number,
          assist_to_phone_number: assist_to_number,
          error: '',
          success: false
        }
        user_number_id = nil
        user_number_name = nil
        if !user_number.match?(phone_regex)
          row_data[:error] = 'Invalid user phone number.'
          upload_user_result << row_data
          next
        else
          user_exist = User.find_by(phone_number: user_number)
          if user_exist.nil?
            row_data[:error] = 'Minister/PA phone number is not associated with our system.'
            upload_user_result << row_data
            next
          else
            user_number_id = user_exist[:id]
            user_number_name = user_exist[:name]
          end
        end

        assist_to_number_user_id = nil
        assist_to_number_user_name = nil
        if !assist_to_number.nil? && !assist_to_number.blank?
          if assist_to_number.match?(phone_regex)
            assist_to_user_exist = User.find_by(phone_number: assist_to_number)
            if assist_to_user_exist.nil?
              row_data[:error] = 'Assist to phone number is not associated with our system.'
              upload_user_result << row_data
              next
            else
              assist_to_number_user_id = assist_to_user_exist[:id]
              assist_to_number_user_name = assist_to_user_exist[:name]
            end
          else
            row_data[:error] = 'Invalid assist to phone number.'
            upload_user_result << row_data
            next
          end
        end

        fetch_user_detail = AuthUser.where(id: user_number_id).first_or_create!
        if !assist_to_number_user_id.nil?
          sync_auth_users(assist_to_number_user_id)
          AuthUser.find_by(id: fetch_user_detail.id).update(
            name: user_number_name,
            phone_number: user_number,
            assist_to_id: assist_to_number_user_id
          )

        else
          AuthUser.find_by(id: fetch_user_detail.id).update(
            name: user_number_name,
            phone_number: user_number,
            assist_to_id: nil
          )
        end
        row_data[:success] = true
        upload_user_result << row_data
      end

      csv_string = CSV.generate do |csv|
        csv << [
          'User Phone Number(Minister/Assistant/PA Phone Number)',
          'Assist To(Minister Phone Number)',
          'Error',
          'Success'
        ]
        upload_user_result.each do |csv_row_data|
          csv << [
            csv_row_data[:minister_number],
            csv_row_data[:assist_to_phone_number],
            csv_row_data[:error],
            csv_row_data[:success]
          ]
        end
      end

      attachments = []
      attachment = {}
      attachment[:content] = csv_string
      attachment[:filename] = "#{SecureRandom.uuid}.csv"
      attachments << attachment

      send_email(
        'Result of manual upload of Minister/Assistant/PA',
        '<div>Hi,<br><div><br>Please find the attachments.<br></div></div>',
        email,
        attachments = attachments
      )

      return render json: {
        success: true,
        message: 'Success. Please check you provided email address for update.'
      }, status: :ok
    rescue StandardError => e
      return render json: {
        success: false,
        message: e.message
      }, status: :bad_request
    end
  end
end