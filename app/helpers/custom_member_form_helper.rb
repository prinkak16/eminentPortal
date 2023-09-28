module CustomMemberFormHelper
  def validate_step_first
    schema = {
      'type' => 'object',
      'required' => ['a'],
      'properties' => {
        'a' => {'type' => 'integer'}
      }
    }
    puts JSON::Validator.validate(schema, { 'a' => 5 })
    puts JSON::Validator.validate(schema, {})
  end

  def fetch_member(phone, form_type)
    CustomMemberForm.where(phone: phone, form_type: form_type)
      .or(CustomMemberForm.where("data -> 'mobiles' ? :query", query: phone)
      .where(form_type: form_type))&.first
  end

  def send_sms(message, phone_number, ct_id = '1007440753033109730')
    require 'httparty'
    options = {
      headers: {
        "Content-Type": 'application/json',
        "api-key": 'notakey',
        "uuid": 'abd3668d-319d-46a6-9ba6-5f7d68abd6fb'
      },
      body: {
        "phone_number": phone_number.to_s,
        "type": 'OTP',
        "sender": 'BJPSRL',
        "message": message.to_s,
        "template_id": ct_id.to_s
      }.to_json
    }
    response = HTTParty.post('http://34.93.208.112/send_sms', options)
    print "\n-------\nSent Message: #{message}\nResponse code is #{response&.code&.to_s}\n"
  end
end