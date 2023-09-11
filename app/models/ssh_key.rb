class SshKey < CcdmsRecord
  validates :key, presence: true

  def private_rsa_key
    OpenSSL::PKey::RSA.new(self.key)
  end

  def public_rsa_key
    private_rsa_key.public_key
  end
end
