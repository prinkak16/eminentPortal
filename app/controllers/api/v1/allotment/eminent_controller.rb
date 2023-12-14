class Api::V1::Allotment::EminentController < BaseApiController
  before_action :authenticate_user
  include Validators::Allotment::Validator
  include UtilHelper
  include MinistryHelper
  include UserHelper
  include MailHelper

  def list
    permission_exist = is_permissible('Eminent', 'ViewAll')
    if permission_exist.nil?
      return render json: {
        success: false,
        message: 'Access to this is restricted. Please check with the site administrator.'
      }, status: :unauthorized
    end

    # compute limit and offset
    limit = params[:limit].present? ? params[:limit] : 10
    offset = params[:offset].present? ? params[:offset] : 0

    # compute search by eminent id
    custom_members = CustomMemberForm
    custom_members = custom_members.left_joins(:vacancy_allotments)
    custom_members = custom_members.where.not('vacancy_allotments.custom_member_form_id is not null and vacancy_allotments.unoccupied_at is null')
    eminent_ids = params[:search_by_id].present? ? params[:search_by_id].split(',') : nil
    unless eminent_ids.nil?
      eminent_ids = eminent_ids.map(&:to_i)
      custom_members = custom_members.where(id: eminent_ids)
    end

    # check form type
    type = CustomMemberForm::TYPE_EMINENT

    # compute state id
    state_ids = params[:entry_type].present? ? params[:entry_type].split(',') : nil
    if state_ids.nil?
      state_ids = []
      fetch_minister_assigned_country_states.each do |country_state|
        state_ids << country_state['id']
      end
    end
    custom_members = custom_members.where(form_type: type, country_state_id: state_ids)

    # compute age group filter
    age_groups = params[:age_group].present? ? params[:age_group].split(',') : nil
    unless age_groups.nil?
      age_group_query = custom_member_age_group_query(age_groups)
      custom_members = custom_members.where(age_group_query)
    end

    # compute channel filter only approved
    custom_members = custom_members.where(aasm_state: 'approved')

    # compute education filter
    educations = params[:education].present? ? params[:education].split(',') : nil
    unless educations.nil?
      educations_json = educations.map { |education| { 'qualification' => education } }.to_json
      custom_members = custom_members.where("data->'educations' @> ?", educations_json)
    end

    # compute gender filter
    genders = params[:gender].present? ? params[:gender].split(',') : nil
    unless genders.nil?
      custom_members = custom_members.where("data->'gender' ?| array[:gender_values]", gender_values: genders)
    end

    # compute profession filter
    professions = params[:profession].present? ? params[:profession].split(',') : nil
    unless professions.nil?
      professions_json = professions.map { |profession| { 'profession' => profession } }.to_json
      custom_members = custom_members.where("data->'professions' @> ?", professions_json)
    end

    # compute profession filter
    category = params[:category].present? ? params[:category].split(',') : nil
    unless category.nil?
      custom_members = custom_members.where("data->'category' ?| array[:category_values]", category_values: category)
    end

    # compute search
    query_search = params[:query].present? ? params[:query].split(',') : nil
    unless query_search.nil?
      search_query = []
      phone_numbers_query = query_search.select { |number| number.match?(/^\d+$/) }
      names_query = query_search.reject { |number| number.match?(/^\d{10}$/) }

      if names_query.size.positive?
        modified_names_query = names_query.map { |element| "LOWER(data->>'name') LIKE '%#{element.downcase}%'" }
        search_query += modified_names_query
      end

      if phone_numbers_query.size.positive?
        modified_names_query = phone_numbers_query.map { |element| "data->>'mobiles' LIKE '%#{element}%'" }
        search_query += modified_names_query
      end

      if phone_numbers_query.size.positive?
        modified_names_query = phone_numbers_query.map { |element| "data->>'id' LIKE '%#{element}%'" }
        search_query += modified_names_query
      end
      custom_members = custom_members.where(search_query.join(' OR '))
    end

    length = custom_members.length
    custom_members = custom_members.order('created_at desc')

    if !custom_members.blank?
      res_data = custom_members.includes(:country_state).limit(limit).offset(offset).as_json(include: [:country_state])
      render json: {
        success: true,
        message: 'Success.',
        data: {
          'members': res_data,
          'length': length
        }
      }, status: :ok
    else
      render json: { success: false, message: 'No member found.' }, status: :not_found
    end
  end

  def assign_vacancy
    begin
      permission_exist = is_permissible('Eminent', 'ViewAll')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      selected_members = params[:selected_members].present? ? CustomMemberForm.where(id: params[:selected_members]) : []
      raise 'No member is selected' if selected_members.empty?

      psu_id = params[:psu_id].present? ? params[:psu_id] : nil
      raise "PSU Id can't be blank." if psu_id.nil?

      country_states = []
      fetch_minister_assigned_country_states.each do |country_state|
        country_states << country_state[:id]
      end

      psu = Organization.joins(:vacancies).where(id: psu_id)
                        .where(vacancies: { country_state_id: country_states })
                        .where(vacancies: { allotment_status: 'vacant', slotting_status: 'slotted' })
                        .group('organizations.id')
                        .select('organizations.id, count(distinct vacancies.id) as vacant_vacancy_count')
      if psu.length.positive?
        if selected_members.count > psu.first.vacant_vacancy_count
          raise "Selected eminent can't be greater than vacancy count"
        end

        vacancies_for_allotment = psu.first.vacancies.take(selected_members.length)

        ActiveRecord::Base.transaction do
          selected_members.each_with_index do |member, index|
            if VacancyAllotment.where(custom_member_form: member, vacancy: vacancies_for_allotment[index], unoccupied_at: nil).count.positive?
              raise "This eminent having (name: #{member.data['name']} and id: #{member.id}) is already assigned to that vacancy."
            else
              allotment = VacancyAllotment.create!(custom_member_form: member, vacancy: vacancies_for_allotment[index])
              file_status = FileStatus.create!(vacancy_allotment: allotment, file_status: 'pending', action_by_id: current_user.id)
              allotment.update!(file_status_id: file_status.id)
              vacancies_for_allotment[index].assign! if vacancies_for_allotment[index].may_assign?
            end
          end
        end

        return render json: {
          success: true,
          message: 'All eminents are assigned.'
        }, status: :ok
      end

    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end
end