module AuthHelper
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
end