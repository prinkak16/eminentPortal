class Api::V1::Allotment::EminentController < BaseApiController
  before_action :authenticate_user
  include Validators::Allotment::Validator
  include UtilHelper
  include MinistryHelper
  include UserHelper
  include MailHelper
  include FilterHelper

  def list
    unless is_permissible?('Allotment', 'View')
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
    assigned_members = VacancyAllotment.where(unoccupied_at: nil).pluck(:custom_member_form_id).uniq
    custom_members = custom_members.where.not(id: assigned_members)
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

    # compute referred by
    referred_by = params[:referred_by].present? ? params[:referred_by] : nil
    if referred_by.present?
      custom_members = custom_members.where("data->'reference' ->> 'name' ILIKE ?", "%#{referred_by}%")
    end

    custom_members = custom_members.order('created_at desc').distinct
    length = custom_members.length

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
      render json: {
        success: false,
        message: 'No member found.',
        data: {
          'members': [],
          'length': 0
        }
      }, status: :ok
    end
  end

  def assign_vacancy
    begin
      unless is_permissible?('Allotment', 'Assign')
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      selected_members = params[:selected_members].present? ? CustomMemberForm.where(id: params[:selected_members]) : []
      raise 'No member is selected' if selected_members.empty?

      psu_id = params[:psu_id].present? ? params[:psu_id] : nil
      raise "PSU Id can't be blank." if psu_id.nil?
      raise "State Id can't be blank." unless params[:state_id].present?

      remarks = params[:remarks].present? ? params[:remarks] : nil

      psu = Organization.where(id: psu_id)
      raise 'PSU not found.' unless psu.present?

      country_state = CountryState.find_by(id: params[:state_id])
      raise 'Country State is not found.' unless country_state.present?

      vacancies = psu.first.vacancies
      vacancies = vacancies.where(vacancies: { country_state_id: country_state.id, allotment_status: 'vacant', slotting_status: 'slotted' })

      raise "Selected eminent can't be greater than vacancy count" if selected_members.count > vacancies.count

      if vacancies.count.positive?
        vacancies_for_allotment = vacancies.take(selected_members.length)

        vacancy_allotment_data = []
        ActiveRecord::Base.transaction do
          selected_members.each_with_index do |member, index|
            raise "Member having (name: #{member.data['name']} and id: #{member.id} is already assigned.)" if VacancyAllotment.where(custom_member_form: member, unoccupied_at: nil).count.positive?
            raise "Vacancy having (id: #{vacancies_for_allotment[index].id} is already occupied.)" if VacancyAllotment.where(vacancy: vacancies_for_allotment[index], unoccupied_at: nil).count.positive?

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
      unless is_permissible?('Allotment', 'View')
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      raise "PSU Id can't be blank." unless params[:psu_id].present?

      psu = params[:psu_id].present? ? Organization.find_by(id: params[:psu_id]) : nil
      raise 'PSU not found.' unless psu.present?

      raise "State Id can't be blank." unless params[:state_id].present?

      state = CountryState.find_by(id: params[:state_id])
      raise 'Country state is not found.' unless state.present?

      limit = params[:limit].present? ? params[:limit] : 10
      offset = params[:offset].present? ? params[:offset] : 0

      assigned_members = CustomMemberForm.joins(vacancy_allotments: [vacancy: :organization])
                                         .where(vacancies: { organization_id: psu, country_state_id: state.id })
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
          message: 'No eminent is assigned.',
          count: 0,
          data: []
        }, status: :ok
      end
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def unassign_member
    begin
      unless is_permissible?('Allotment', 'Unassign')
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      member = params[:member_id].present? ? CustomMemberForm.find_by(id: params[:member_id]) : nil
      raise "Eminent doesn't exist." unless member.present?

      member_allotment = VacancyAllotment.where(custom_member_form_id: member)
      raise 'Eminent is not assigned yet.' unless member_allotment.present?

      unassign_remark = params[:remarks].present? ? params[:remarks] : nil

      member_allotment = member_allotment.where(unoccupied_at: nil)

      if member_allotment.present?
        member_allotment.first.update!(unoccupied_at: DateTime.now, remarks: unassign_remark)
        allotted_vacancy = member_allotment.first.vacancy
        allotted_vacancy.unassign! if allotted_vacancy.may_unassign?
        file_status = member_allotment.first.file_status
        file_status.destroy if file_status.present?

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

  def vacancies_history
    begin
      unless is_permissible?('Allotment', 'View')
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      psu_id = params[:psu_id].present? ? params[:psu_id] : nil
      raise "PSU Id can't be blank." unless psu_id.present?

      psu = Organization.find_by(id: psu_id)
      raise 'PSU not found.' unless psu.present?

      raise "State Id can't be blank." unless params[:state_id].present?

      state = CountryState.find_by(id: params[:state_id])
      raise 'Country state is not found' unless state.present?

      limit = params[:limit].present? ? params[:limit] : 10
      offset = params[:offset].present? ? params[:offset] : 0

      sql = "SELECT
               allotment_history.vacancy_id AS vacancy_id,
               vacancies.designation AS vacancy_designation,
               custom_member_forms.data->>'name' as member_name,
               organizations.id AS psu_id,
               organizations.name AS psu_name,
               to_char(allotment_history.unoccupied_at, 'YYYY-MM-DD HH24:MI:SS') AS unoccupied_at,
               to_char(allotment_history.event_time, 'YYYY-MM-DD HH24:MI:SS') AS entry_at,
               allotment_history.remarks AS remarks
             FROM
                  (
                    SELECT id, vacancy_id, custom_member_form_id, unoccupied_at, remarks, created_at AS event_time, deleted_at FROM vacancy_allotments
                    UNION
                    select id, vacancy_id, custom_member_form_id, unoccupied_at, remarks, unoccupied_at AS event_time, deleted_at FROM vacancy_allotments where unoccupied_at is not null
                  ) AS allotment_history
               LEFT JOIN custom_member_forms on custom_member_forms.id = allotment_history.custom_member_form_id
               INNER JOIN vacancies ON vacancies.id = allotment_history.vacancy_id
               INNER JOIN organizations ON organizations.id = vacancies.organization_id
               WHERE allotment_history.deleted_at IS NULL
               AND organizations.id = #{psu.id}
               AND vacancies.country_state_id IN (#{state.id})
               ORDER BY allotment_history.event_time DESC
            "

      vacancy_allotment_history = VacancyAllotment.find_by_sql(sql + " LIMIT #{limit} OFFSET #{offset};")

      vacancy_allotment_count = VacancyAllotment.find_by_sql(sql).length
      if vacancy_allotment_history.length.positive?
        result = []
        vacancy_allotment_history.each do |vacancy|
          allotment_status = vacancy.unoccupied_at.nil? ? 'Assigned' : (vacancy.unoccupied_at == vacancy.entry_at ? 'Unassigned' : 'Assigned')
          result << {
            member_name: vacancy.member_name,
            vacancy_id: vacancy.vacancy_id,
            psu_id: vacancy.psu_id,
            psu_name: vacancy.psu_name,
            allotment_status: allotment_status,
            vacancy_designation: vacancy.vacancy_designation,
            created_at: vacancy.entry_at,
            remarks: vacancy.remarks
          }
        end

        return render json: {
          success: true,
          count: vacancy_allotment_count,
          data: result,
          message: 'Data received successfully.'
        }
      else
        return render json: {
          success: true,
          message: 'No Vacancy is found.'
        }, status: :ok
      end
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end
  def eminent_filters
    unless is_permissible?('Allotment', 'View')
      return render json: {
        success: false,
        message: 'Access to this is restricted. Please check with the site administrator.'
      }, status: :unauthorized
    end

    result = {
      'filters': [
        get_entry_type_filter,
        get_age_group_filter,
        get_qualification_filter,
        get_gender_filter,
        get_profession_filter,
        get_category_filter
      ]
    }

    render json: { success: true, data: result, message: 'Home filters.' }, status: 200
  end

end