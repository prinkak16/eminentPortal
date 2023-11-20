module UserHelper

  def is_user_have_portal_permission(user_id)
    sql = "SELECT
      u.id AS user_id,
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
    WHERE
    u.id = #{user_id}
    AND
    ca.name = '#{ENV['CLIENT_APP_PERMISSION']}'
    AND
    up.deleted_at IS null
    AND
    utl.location_type = 'CountryState'
    GROUP BY u.id;"

    minister = User.find_by_sql(sql)
    {
      'isExist': minister.count.positive? ? true : false,
      'user': minister.count.positive? ? minister.first : nil
    }
  end

  def fetch_user_information(user_ids)
    sql = "SELECT
      u.id AS user_id,
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
    WHERE
    u.id IN (#{user_ids.join(',')})
    AND
    ca.name = '#{ENV['CLIENT_APP_PERMISSION']}'
    AND
    up.deleted_at IS null
    AND
    utl.location_type = 'CountryState'
    GROUP BY u.id;"
    if user_ids.size.positive?
      user = User.find_by_sql(sql)
      {
        'isExist': user.count.positive? ? true : false,
        'user': user.count.positive? ? user : []
      }
    else
      {
        'isExist': false,
        'user': []
      }
    end
  end

  def fetch_auth_users(user_ids)
    result = {
      'isExist': false,
      'user': []
    }
    if user_ids.length.positive?
      result[:isExist] = true
      result[:user] = AuthUser.where(id: user_ids)
    end
    result
  end

end