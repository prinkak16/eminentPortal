module MailHelper
  include SendGrid

  def send_email(subject, content, recipient, attachments = [])
    require 'sendgrid-ruby'

    from = Email.new(email: 'system-generated@jarvis.consulting')
    html_content = Content.new(type: 'text/html', value: content)
    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])

    to = Email.new(email: recipient)
    mail = Mail.new(from, subject, to, html_content)
    attachments.each do |att|
      attachment = Attachment.new
      attachment.content = Base64.strict_encode64 att[:content]
      attachment.type = 'application/csv'
      attachment.filename = att[:filename]
      attachment.disposition = 'attachment'
      attachment.content_id = 'CSV'
      mail.add_attachment(attachment)
    end
    sg.client.mail._('send').post(request_body: mail.to_json)
  end
end