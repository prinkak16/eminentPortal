module MinistryHelper
  include ApplicationHelper

  def fetch_ministry_by_id(ministry_id)
    Ministry.find_by_id(ministry_id)
  end

  def fetch_client_app_user

  end
end