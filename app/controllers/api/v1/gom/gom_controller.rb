class Api::V1::Gom::GomController < BaseApiController
  before_action :authenticate_user
  include Validators::User::Validator
  include UtilHelper
  include MinistryHelper
  include UserHelper
  include MailHelper

  def minister_list
    begin
      permission_exist = is_permissible('GOMManagement', 'MinisterList')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      # compute limit and offset
      limit = params[:limit].present? ? params[:limit] : 50
      offset = params[:offset].present? ? params[:offset] : 0
      name = params[:name].present? ? params[:name] : nil

      auth_user = AuthUser
      auth_user = params[:name].present? && params[:name].length > 2 ? auth_user.name_similar(params[:name]) : auth_user.select(:id, :name).order(created_at: :desc)

      return render json: {
        success: true,
        message: 'Success',
        data: {
          'ministries': auth_user.limit(limit).offset(offset),
          'count': auth_user.count(:id)
        }
      }, status: :ok
    rescue StandardError => e
      return render json: {
        success: false,
        message: e.message
      }, status: :bad_request
    end
  end

  def filter_assigned_ministries
    begin
      permission_exist = is_permissible('GOMManagement', 'FilterMinistry')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :bad_request
      end

      assigned_ministries = []

      # compute limit and offset
      limit = params[:limit].present? ? params[:limit] : 50
      offset = params[:offset].present? ? params[:offset] : 0

      minister_ids = params[:minister_ids].present? ? params[:minister_ids] : ''
      ministry_ids = params[:ministry_ids].present? ? params[:ministry_ids] : ''

      sql = "SELECT
          au.id,
          au.name,
          array_remove(
              array_agg(
                  CASE
                  WHEN um.is_minister IS false THEN mi.name
                  ELSE null
                  END
              ), null
            ) AS assigned_ministries,
          array_remove(
              array_agg(
                  CASE
                  WHEN um.is_minister THEN mi.name
                  ELSE null
                  END
              ), null
             ) AS allocated_ministries
        FROM public.auth_users AS au
        LEFT JOIN public.user_ministries AS um
        ON au.id = um.user_id
        LEFT JOIN public.ministries AS mi
        ON um.ministry_id = mi.id
        WHERE assist_to_id is null"

      if minister_ids.length.positive? && ministry_ids.length.positive?
        sql += " AND au.id IN (#{minister_ids}) AND um.ministry_id IN (#{ministry_ids})"
      else
        if minister_ids.length.positive?
          sql += " AND au.id IN (#{minister_ids})"
        end

        if ministry_ids.length.positive?
          sql += " AND um.ministry_id IN (#{ministry_ids})"
        end
      end
      sql += ' GROUP BY au.id, au.name'
      puts sql
      user_ministries = UserMinistry.find_by_sql(sql + " LIMIT #{limit} OFFSET #{offset}")

      # fetch all the user ids
      user_ids = user_ministries.map { |row| row['id'] }

      # fetch all the user information
      user_information = fetch_user_information(user_ids)
      user_information = user_information[:user].index_by(&:user_id)

      # fetch all the auth user information
      auth_user_information = fetch_auth_users(user_ids)
      auth_user_information = auth_user_information[:user].index_by(&:id)

      user_ministries.each do |user_ministry|
        assigned_ministries << {
          user_id: user_ministry.id.present? ? user_ministry.id : nil,
          name: user_ministry.name.present? ? user_ministry.name : nil,
          allocated_ministries: user_ministry.allocated_ministries.present? ? user_ministry.allocated_ministries : [],
          assigned_ministries: user_ministry.assigned_ministries.present? ? user_ministry.assigned_ministries : [],
          assigned_states: user_information[user_ministry[:id]].present? ? user_information[user_ministry[:id]][:user_alloted_states] : []
        }
      end

      render json: {
        success: true,
        message: 'Success',
        data: {
          value: assigned_ministries,
          count: UserMinistry.find_by_sql(sql).count
        }
      }, status: :ok
    rescue StandardError => e
      return render json: {
        success: false,
        message: e.message
      }, status: :bad_request
    end
  end

  def search_assigned_ministries
    permission_exist = is_permissible('GOMManagement', 'SearchMinistry')

    if permission_exist.nil?
      return render json: {
        success: false,
        message: 'Access to this is restricted. Please check with the site administrator.'
      }, status: :bad_request
    end

    assigned_ministries = []

    # compute limit and offset
    limit = params[:limit].present? ? params[:limit] : 50
    offset = params[:offset].present? ? params[:offset] : 0
    minister_name = params[:minister_name].present? ? params[:minister_name] : ''
    ministry_name = params[:ministry_name].present? ? params[:ministry_name] : ''

    sql = "SELECT
      info.user_id,
      info.minister_name,
      info.pa_name,
      array_remove(
        array_agg(
          CASE
          WHEN info.is_minister IS false THEN info.ministry_name
          ELSE null
          END
        ), null
      ) AS assigned_ministries,
      array_remove(
        array_agg(
          CASE
          WHEN info.is_minister THEN info.ministry_name
          ELSE null
          END
        ), null
      ) AS allocated_ministries
    FROM
    (
      SELECT
        au.id as user_id,
        au.name AS minister_name,
        PA.name AS pa_name,
        mi.name AS ministry_name,
        um.is_minister AS is_minister
  "
    sql += ", word_similarity(au.name, '#{minister_name}') AS ms_minister " if minister_name.length > 2
    sql += ", word_similarity(mi.name, '#{ministry_name}') AS ms_ministry " if ministry_name.length > 2
    sql += "FROM public.auth_users AS au
  LEFT JOIN public.user_ministries AS um
  ON au.id = um.user_id
  LEFT JOIN public.ministries AS mi
  ON um.ministry_id = mi.id
  LEFT JOIN public.auth_users AS PA
  ON au.id = PA.assist_to_id
  WHERE au.assist_to_id IS null "
    sql += " AND LOWER(au.name) LIKE LOWER('%#{minister_name}%') " if minister_name.length > 2
    sql += " AND LOWER(mi.name) LIKE LOWER('%#{ministry_name}%') " if ministry_name.length > 2
    sql += 'GROUP BY au.id, au.name, PA.name, mi.name, um.is_minister'
    sql += ' ,mi.name' if ministry_name.length > 2
    sql += ' ORDER BY '
    sql += ' ms_minister DESC, ' if minister_name.length > 2
    sql += ' ms_ministry DESC, ' if ministry_name.length > 2
    sql += 'MAX(um.created_at) IS null, MAX(um.created_at) DESC'
    sql += ') AS info
    GROUP BY info.user_id, info.minister_name, info.pa_name'
    user_ministries = UserMinistry.find_by_sql(sql + " LIMIT #{limit} OFFSET #{offset};")

    # fetch all the user ids
    user_ids = user_ministries.map { |row| row['user_id'] }

    # fetch all the user information
    user_information = fetch_user_information(user_ids)
    user_information = user_information[:user].index_by(&:user_id)

    # fetch all the auth user information
    auth_user_information = fetch_auth_users(user_ids)
    auth_user_information = auth_user_information[:user].index_by(&:id)

    user_ministries.each do |user_ministry|
      assigned_ministries << {
        user_id: user_ministry.user_id.present? ? user_ministry.user_id : nil,
        name: user_ministry.minister_name.present? ? user_ministry.minister_name : nil,
        pa_name: user_ministry.pa_name.present? ? user_ministry.pa_name : nil,
        allocated_ministries: user_ministry.allocated_ministries.present? ? user_ministry.allocated_ministries : [],
        assigned_ministries: user_ministry.assigned_ministries.present? ? user_ministry.assigned_ministries : [],
        assigned_states: user_information[user_ministry[:user_id]].present? ? user_information[user_ministry[:user_id]][:user_alloted_states] : []
      }
    end

    render json: {
      success: true,
      message: 'Success',
      data: {
        value: assigned_ministries,
        count: UserMinistry.find_by_sql(sql).count
      }
    }, status: :ok

  rescue StandardError => e
    render json: {
      success: false,
      message: e.message
    }, status: :bad_request
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
          action: row[2],
          error: '',
          success: false,
          message: ''
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

        if row_data[:action] == 'DELETE'
          user_detail = AuthUser.find_by(phone_number: row_data[:minister_number])
          assist_to_user_detail = AuthUser.find_by(phone_number: row_data[:assist_to_phone_number])
          if user_detail.present? && assist_to_user_detail.present?
            if user_detail.assist_to_id == assist_to_user_detail.id
              user_detail.destroy!
              row_data[:success] = true
              row_data[:message] = 'PA is deleted successfully.'
              upload_user_result << row_data
            end
          end
        elsif row_data[:action] == 'ADD'
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
          row_data[:message] = 'PA is mapped successfully.'
          upload_user_result << row_data
        end
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
            csv_row_data[:success],
            csv_row_data[:message]
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