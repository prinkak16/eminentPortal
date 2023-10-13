module OrganizationHelper
  include ApplicationHelper
  def fetch_organization_by_id(organization_id)
    Organization.find_by_id(organization_id)
  end
end