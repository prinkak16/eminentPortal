class Api::V1::Gom::GomController < BaseApiController
  before_action :authenticate_user
  include Validators::User::Validator
  include UtilHelper
  include MinistryHelper
  include UserHelper
  include MailHelper
  def search_assigned_ministries
    begin
      assigned_ministries = []

      # compute limit and offset
      limit = params[:limit].present? ? params[:limit] : 50
      offset = params[:offset].present? ? params[:offset] : 0
      minister_name = params[:minister_name].present? ? params[:minister_name] : ''
      ministry_name = params[:ministry_name].present? ? params[:ministry_name] : ''

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
         ) AS allocated_ministries,
         MAX(um.created_at) as latest_created_at "
      sql += ", word_similarity(au.name, '#{minister_name}') AS ms_minister " if minister_name.length > 2
      sql += ", word_similarity(mi.name, '#{ministry_name}') AS ms_ministry " if ministry_name.length > 2
      sql += "FROM public.auth_users AS au
      LEFT JOIN public.user_ministries AS um
      ON au.id = um.user_id
      LEFT JOIN public.ministries AS mi
      ON um.ministry_id = mi.id
      WHERE au.assist_to_id IS null "
      sql += " AND au.name % '#{minister_name}' " if minister_name.length > 2
      sql += " AND mi.name % '#{ministry_name}' " if ministry_name.length > 2
      sql += 'GROUP BY au.id, au.name'
      sql += ' ,mi.name' if ministry_name.length > 2
      sql += ' ORDER BY '
      sql += ' ms_minister DESC, ' if minister_name.length > 2
      sql += ' ms_ministry DESC, ' if ministry_name.length > 2
      sql += 'MAX(um.created_at) IS null, MAX(um.created_at) DESC'

      user_ministries = UserMinistry.find_by_sql(sql + " LIMIT #{limit} OFFSET #{offset};")

      # fetch all the user ids
      user_ids = user_ministries.map { |row| row['id'] }

      # fetch all the user information
      user_information = fetch_user_information(user_ids)
      user_information = user_information[:user].index_by(&:user_id)

      user_ministries.each do |user_ministry|
        assigned_ministries << {
          user_id: user_ministry.id.present? ? user_ministry.id : nil,
          name: user_information[user_ministry[:id]].present? ? user_information[user_ministry[:id]].name : nil,
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

  def minister_list
    begin
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

  def assigned_ministries_by_filters
    begin
      assigned_ministries = []

      # compute limit and offset
      limit = params[:limit].present? ? params[:limit] : 50
      offset = params[:offset].present? ? params[:offset] : 0

      minister_ids = params[:minister_ids].present? ? params[:minister_ids] : ''
      ministry_ids = params[:ministry_ids].present? ? params[:ministry_ids] : ''

      sql = "SELECT
        um.user_id,
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
           ) AS allocated_ministries,
         MAX(um.created_at) as latest_created_at
      FROM public.user_ministries AS um
      LEFT JOIN public.ministries AS mi
      ON um.ministry_id = mi.id
      LEFT JOIN public.auth_users AS au
      ON um.user_id = au.id"
      if minister_ids.length.positive? && ministry_ids.length.positive?
        sql += " WHERE um.user_id IN (#{minister_ids}) AND um.ministry_id IN (#{ministry_ids})"
      else
        if minister_ids.length.positive?
          sql += " WHERE um.user_id IN (#{minister_ids})"
        end

        if ministry_ids.length.positive?
          sql += " WHERE um.ministry_id IN (#{ministry_ids})"
        end
      end
      sql += ' GROUP BY um.user_id, au.name'

      user_ministries = UserMinistry.find_by_sql(sql + " LIMIT #{limit} OFFSET #{offset}")

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
      return render json: {
        success: false,
        message: e.message
      }, status: :bad_request
    end
  end

end