module AuthHelper
  def ccdms_secret_key
    return Rails.application.credentials.dig(:secret_key_ccdms)
  end
  def is_signed_in_user?
    session[:user_id].present?
  end

  def get_public_key
    keys = []
    ssh_key = SshKey.all
    ssh_key.each do |key|
      private_key = key.private_rsa_key
      jwk = JWT::JWK.new(private_key)
      kid = jwk.kid
      keys << { public_key: key&.public_rsa_key.to_s, kid: kid }
    end
    return keys
  end

  def handle_params(params:)
    app_config = SSO_CONFIG
    token = params[:id_token]
    keys_kids = get_public_key()
    keys_kids.each do |kk_pair|
      REDIS_CLIENT_APP.set(kk_pair[:kid], kk_pair[:public_key])
    end
    key = OpenSSL::PKey::RSA.new(REDIS_CLIENT_APP.get(params[:kid]))
    jti_token = JWT.decode token, key, true, { algorithm: 'RS512' }
    return User.find_by(jti: jti_token[0])&.id
  end

  def sync_auth_users(user_id)
    user_detail = User.find_by(id: user_id)
    fetch_user_detail = AuthUser.where(id: user_id).first_or_create!
    auth_user = AuthUser.find_by(id: fetch_user_detail.id).update(name: user_detail&.name, phone_number: user_detail&.phone_number)
    return auth_user
  end

  def handle_api_auth(api_token:)
    jti_token = JWT.decode api_token, ccdms_secret_key
    if jti_token[0]['user_id'].present?
      return User.find_by(jti: jti_token[0]['user_id'])&.id
    else
      return nil
    end
  end
end