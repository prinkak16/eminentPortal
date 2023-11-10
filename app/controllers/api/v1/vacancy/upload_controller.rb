class Api::V1::Vacancy::UploadController < BaseApiController
  before_action :authenticate_user
  include CustomMemberFormHelper
  include UtilHelper
  include MetadataHelper

  def manual_upload
    puts 'manual_upload'
  end

end