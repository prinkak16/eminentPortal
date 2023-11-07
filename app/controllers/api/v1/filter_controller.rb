class Api::V1::FilterController < BaseApiController
  before_action :authenticate_user
  include FilterHelper
  include Validators::Metadata::Validator
  include UtilHelper

  def home
    result = {
      'filters': [
        get_entry_type_filter,
        get_channel_filter,
        get_age_group_filter,
        get_aasm_state_filter,
        get_qualification_filter,
        get_gender_filter,
        get_profession_filter,
        get_category_filter
      ]
    }

    render json: { success: true, data: result, message: 'Home filters.' }, status: 200
  end

  def gom_management
    minister_name = params[:minister_name].present? ? params[:minister_name] : ''
    ministry_name = params[:ministry_name].present? ? params[:ministry_name] : ''

    result = {
      'filters': [
        get_minister_filters(minister_name),
        get_ministry_filters(ministry_name)
      ]
    }

    render json: { success: true, data: result, message: 'GOM filters.' }, status: 200
  end
end