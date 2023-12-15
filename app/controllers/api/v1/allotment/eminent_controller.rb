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

      remarks = params[:remarks].present? ? params[:remarks] : nil

      country_states = []
      fetch_minister_assigned_country_states.each do |country_state|
        country_states << country_state[:id]
      end

      psu = Organization.joins(:vacancies).where(id: psu_id)
                        .where(vacancies: { country_state_id: country_states })
                        .where(vacancies: { allotment_status: 'vacant', slotting_status: 'slotted' }).distinct
      if psu.count.positive?
        if selected_members.count > psu.first.vacancies.count
          raise "Selected eminent can't be greater than vacancy count"
        end

        vacancies_for_allotment = psu.first.vacancies.take(selected_members.length)

        vacancy_allotment_data = []
        ActiveRecord::Base.transaction do
          selected_members.each_with_index do |member, index|
            if VacancyAllotment.where(custom_member_form: member, vacancy: vacancies_for_allotment[index], unoccupied_at: nil).count.positive?
              raise "This eminent having (name: #{member.data['name']} and id: #{member.id}) is already assigned to that vacancy."
            else
              allotment = VacancyAllotment.create!(custom_member_form: member, vacancy: vacancies_for_allotment[index], remarks: remarks)
              file_status_level = FileStatusLevel.first
              file_status = FileStatus.create!(vacancy_allotment_id: allotment.id, action_by_id: current_user.id, file_status_level_id: file_status_level.id)
              FileStatusActivity.create!(file_status_id: file_status.id, vacancy_allotment_id: allotment.id, file_status_level_id: file_status_level.id)
              allotment.update!(file_status_id: file_status.id)
              vacancies_for_allotment[index].assign! if vacancies_for_allotment[index].may_assign?
              vacancy_allotment_data << {
                psu_id: psu.first.id,
                psu_name: psu.first.name,
                vacancy_id: vacancies_for_allotment[index].id,
                member_id: member.id,
                member_name: member.data['name'],
                remarks: remarks
              }
            end
          end
        end

        return render json: {
          success: true,
          message: 'All eminents are assigned.',
          data: vacancy_allotment_data
        }, status: :ok
      else
        return render json: {
          success: true,
          message: 'No PSU is available for user allotted locations'
        }, status: :ok
      end

    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def assigned_members
    begin
      permission_exist = is_permissible('Eminent', 'ViewAll')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      psu = params[:psu_id].present? ? Organization.find_by(id: params[:psu_id]) : nil
      raise "PSU Id can't be blank." unless psu.present?

      limit = params[:limit].present? ? params[:limit] : 10
      offset = params[:offset].present? ? params[:offset] : 0

      assigned_members = CustomMemberForm.joins(vacancy_allotments: [vacancy: :organization])
                                         .where(vacancies: { organization_id: psu })
                                         .where(vacancy_allotments: { unoccupied_at: nil })
                                         .select('custom_member_forms.*, organizations.id as psu_id, organizations.name as psu_name, vacancies.id as vacancy_id, vacancy_allotments.remarks as allotment_remarks')
      assigned_members_count = assigned_members.length
      assigned_members = assigned_members.limit(limit).offset(offset)
      if assigned_members.exists?
        assigned_members_data = []
        assigned_members.each do |member|
          assigned_members_data << {
            psu_id: member.psu_id,
            psu_name: member.psu_name,
            vacancy_id: member.vacancy_id,
            member_data: member.as_json
          }
        end
        return render json: {
          success: true,
          message: 'Data received successfully.',
          count: assigned_members_count,
          allotment_remarks: assigned_members.pluck('vacancy_allotments.remarks').uniq,
          data: assigned_members_data
        }
      else
        return render json: {
          success: true,
          message: 'No eminent is assigned.'
        }
      end
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def unassign_member
    begin
      permission_exist = is_permissible('Eminent', 'ViewAll')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      member = params[:member_id].present? ? CustomMemberForm.find_by(id: params[:member_id]) : nil
      raise "Eminent doesn't exist." unless member.present?

      member_allotment = VacancyAllotment.where(custom_member_form_id: member)
      raise 'Eminent is not assigned yet.' unless member_allotment.present?

      member_allotment = member_allotment.where(unoccupied_at: nil)

      if member_allotment.present?
        member_allotment.first.update!(unoccupied_at: DateTime.now)
        allotted_vacancy = member_allotment.first.vacancy
        allotted_vacancy.unassign! if allotted_vacancy.may_unassign?
        file_status = member_allotment.first.file_status
        file_status_activity = FileStatusActivity.find_by(file_status_id: file_status) if file_status.present?
        file_status.destroy if file_status.present?
        file_status_activity.destroy if file_status_activity.present?

        return render json: {
          success: true,
          message: "#{member.data['name']} is unassigned successfully."
        }
      else
        return render json: {
          success: true,
          message: 'Eminent is already unassigned.'
        }
      end

    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end
end