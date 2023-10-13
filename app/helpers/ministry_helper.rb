module MinistryHelper
  include ApplicationHelper

  def fetch_ministry_by_id(ministry_id)
    Ministry.find_by_id(ministry_id)
  end
end