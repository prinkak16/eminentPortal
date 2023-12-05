class Api::V1::FilterController < BaseApiController
  before_action :authenticate_user
  include FilterHelper
  include Validators::Metadata::Validator
  include UtilHelper
  include VacancyFilterHelper

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

    render json: { success: true, data: result, message: 'gom filters.' }, status: 200
  end

  def vacancy_ministry_wise
    ministry_name = params[:ministry_name].present? ? params[:ministry_name] : ''
    department_name = params[:department_name].present? ? params[:department_name] : ''
    org_name = params[:organization_name].present? ? params[:organization_name] : ''

    result = {
      'filters': [
        fetch_vacancy_ministry_filters(ministry_name),
        fetch_position_status_filter,
        fetch_state_filter
      ]
    }

    render json: { success: true, data: result, message: 'Vacancy ministry wise filters.' }, status: 200
  end

  def vacancy_organization_wise
    ministry_name = params[:ministry_name].present? ? params[:ministry_name] : ''
    department_name = params[:department_name].present? ? params[:department_name] : ''
    org_name = params[:organization_name].present? ? params[:organization_name] : ''

    result = {
      'filters': [
        fetch_vacancy_ministry_filters(ministry_name),
        fetch_vacancy_department_filters(department_name),
        fetch_vacancy_organization_filters(org_name),
        fetch_ratna_type_filter,
        fetch_position_status_filter,
        fetch_state_filter
      ]
    }

    render json: { success: true, data: result, message: 'Vacancy organization wise filters.' }, status: 200
  end

  def vacancy_wise
    ministry_name = params[:ministry_name].present? ? params[:ministry_name] : ''
    department_name = params[:department_name].present? ? params[:department_name] : ''
    org_name = params[:organization_name].present? ? params[:organization_name] : ''

    result = {
      'filters': [
        fetch_vacancy_ministry_filters(ministry_name),
        fetch_vacancy_department_filters(department_name),
        fetch_vacancy_organization_filters(org_name),
        fetch_ratna_type_filter,
        fetch_position_status_filter,
        fetch_state_filter
      ]
    }

    render json: { success: true, data: result, message: 'Vacancy wise filters.' }, status: 200
  end

  def slotting
    ministry_name = params[:ministry_name].present? ? params[:ministry_name] : ''
    department_name = params[:department_name].present? ? params[:department_name] : ''
    org_name = params[:organization_name].present? ? params[:organization_name] : ''

    result = {
      'filters': [
        fetch_vacancy_ministry_filters(ministry_name),
        fetch_vacancy_department_filters(department_name),
        fetch_vacancy_organization_filters(org_name),
        fetch_ratna_type_filter,
        fetch_position_status_filter,
        fetch_state_filter
      ]
    }

    render json: { success: true, data: result, message: 'Slotting filters.' }, status: 200
  end

  def allotment
    ministry_name = params[:ministry_name].present? ? params[:ministry_name] : ''
    department_name = params[:department_name].present? ? params[:department_name] : ''
    org_name = params[:organization_name].present? ? params[:organization_name] : ''

    result = {
      'filters': [
        fetch_vacancy_ministry_filters(ministry_name),
        fetch_vacancy_department_filters(department_name),
        fetch_vacancy_organization_filters(org_name),
        fetch_ratna_type_filter,
        fetch_state_filter
      ]
    }

    render json: { success: true, data: result, message: 'Slotting filters.' }, status: 200
  end

  def allotment_eminents
    result = {
      'filters': [
        get_entry_type_filter,
        get_qualification_filter,
        get_profession_filter,
        get_category_filter,
        get_gender_filter,
        get_age_group_filter
      ]
    }

    render json: { success: true, data: result, message: 'Allotment Eminent Filters.' }, status: 200
  end
end