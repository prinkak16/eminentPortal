class SsoClient
  def self.config
    begin
      temp_config= YAML.load(ERB.new(File.read("config/sso_client.yml")).result, aliases: true).with_indifferent_access || {}
    rescue
      temp_config = YAML.load(ERB.new(File.read("config/sso_client.yml")).result).with_indifferent_access || {}
    end

    if Rails.env.production?
      final_config = temp_config[:production]
    elsif Rails.env.test?
      final_config = temp_config[:test]
    else
      final_config = temp_config[:development]
    end
    final_config[:callback_url] = final_config['callback_url'].to_s
    final_config[:payload_url] = final_config['auth_server'].to_s + '/sso/payload'
    final_config[:public_key_api] = final_config['auth_server'].to_s + '/sso/public_keys'
    final_config[:root_url] = final_config['root_url'].to_s
    final_config[:sign_in_url] = final_config['sign_in_url'].to_s
    final_config[:sso_username] = final_config['sso_username'].to_s
    final_config[:sso_password] = final_config['sso_password'].to_s
    final_config
  end
end

SSO_CONFIG = SsoClient.config