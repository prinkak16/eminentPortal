module DepartmentHelper
  include ApplicationHelper

  def fetch_ministry_department_by_id(ministry_id, department_id)
    Department.where(ministry_id: ministry_id, department_id: department_id)
  end
end