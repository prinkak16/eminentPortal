class Api::V1::CustomMemberFormController < BaseApiController
  before_action :authenticate_user
  include CustomMemberFormHelper
  include UtilHelper
  include MetadataHelper

  def fetch_by_number
    unless is_permissible?('Home', 'Edit')
      return render json: {
        success: false,
        message: 'Access to this is restricted. Please check with the site administrator.'
      }, status: :unauthorized
    end

    if params[:phone_number].nil? || !params[:phone_number].match?(phone_regex)
      return render json: {
        success: false,
        message: 'Please provide a phone number.',
        data: nil
      }, status: :bad_request
    end

    assigned_states = []
    fetch_user_assigned_country_states.each do |country_state|
      assigned_states << country_state['id']
    end

    custom_member = fetch_member(params[:phone_number], CustomMemberForm::TYPE_EMINENT)
    if custom_member.nil?
      return render json: {
        success: false,
        message: 'No eminent associated with the phone number.',
        data: nil
      }, status: :bad_request
    end

    if assigned_states.include? custom_member.country_state_id
      return render json: {
        success: true,
        message: 'Eminent exist.',
        data: custom_member
      }, status: :ok
    else
      cm_data = custom_member[:data].present? ? custom_member[:data] : nil
      eminent_name = cm_data['name'].present? ? cm_data['name'] : nil
      state_name = custom_member.country_state.present? ? custom_member.country_state.name : nil

      return render json: {
        success: false,
        message: "User(#{eminent_name}) exist in other state(#{state_name}).",
        data: nil
      }, status: :bad_request
    end

  end
  def add
    begin
      add_permission_exist = is_permissible('Eminent', 'Add')
      edit_permission_exist = is_permissible('Eminent', 'Edit')
      if add_permission_exist.nil? && edit_permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      # check if the base of the eminent form is valid
      is_form_params_valid = validate_form(@@schema_base, params.as_json)
      unless is_form_params_valid[:is_valid]
        return render json: {
          success: false,
          message: 'Invalid request',
          error: is_form_params_valid[:error],
          # log: is_form_params_valid[:log]
        }, status: :bad_request
      end

      # check if the data of the eminent is valid
      is_form_data_is_valid = {
        'is_valid': false,
        'error': [],
        'log': []
      }
      case params['is_draft']
      when true
        case params['form_step']
        when 1
          is_form_data_is_valid = validate_form(@@schema_first_step_progress, params['data'].as_json)
        when 2
          is_form_data_is_valid = validate_form(@@schema_second_step_progress, params['data'].as_json)
        when 3
          is_form_data_is_valid = validate_form(@@schema_third_step_progress, params['data'].as_json)
        when 4
          is_form_data_is_valid = validate_form(@@schema_fourth_step_progress, params['data'].as_json)
        when 5
          is_form_data_is_valid = validate_form(@@schema_fifth_step_progress, params['data'].as_json)
        when 6
          is_form_data_is_valid = validate_form(@@schema_sixth_step_progress, params['data'].as_json)
        end
      else
        case params['form_step']
        when 1
          is_form_data_is_valid = validate_form(@@schema_first_step, params['data'].as_json)
        when 2
          is_form_data_is_valid = validate_form(@@schema_second_step, params['data'].as_json)
        when 3
          is_form_data_is_valid = validate_form(@@schema_third_step, params['data'].as_json)
        when 4
          is_form_data_is_valid = validate_form(@@schema_fourth_step, params['data'].as_json)
        when 5
          is_form_data_is_valid = validate_form(@@schema_fifth_step, params['data'].as_json)
        when 6
          is_form_data_is_valid = validate_form(@@schema_sixth_step, params['data'].as_json)
        end
      end
      unless is_form_data_is_valid[:is_valid]
        return render json: {
          success: false,
          message: 'Invalid request',
          error: is_form_data_is_valid[:error],
          # log: is_form_data_is_valid[:log]
        }, status: :bad_request
      end

      custom_member = params[:data][:id].present? ? CustomMemberForm.find_by_id(params[:data][:id]) : nil
      phone_number = params[:data][:mobiles]
      # Check for duplicate phone number
      if phone_number.size != phone_number.to_set.size
        return render json: {
          success: false,
          message: 'Phone number has already been added by you, please provide a another phone number.'
        }, status: :bad_request
      end
      form_type = params[:form_type]
      is_draft = params[:is_draft]
      existing_custom_users_found = false
      eminent_channel = params[:channel].present? ? params[:channel] : nil

      # check if the country state id valid used only for creation of eminent_personality type custom member form
      cs = params[:state_id].present? ? params[:state_id] : nil
      country_state = CountryState.where(id: cs).exists?
      unless country_state
        return render json: {
          success: false,
          message: 'Invalid country state id provided.'
        }, status: :bad_request
      end

      if form_type === CustomMemberForm::TYPE_EMINENT
        if !existing_custom_users_found && phone_number.present?
          existing_custom_users_found = custom_member_exists?(phone_number, form_type, custom_member&.id)
        end
      end

      if existing_custom_users_found
        return render json: {
          success: false,
          message: 'Phone number already exist.'
        }, status: :bad_request
      end

      if custom_member.blank?
        if add_permission_exist.nil?
          return render json: {
            success: false,
            message: 'Access to this is restricted. Please check with the site administrator.'
          }, status: :unauthorized
        end
        custom_member = CustomMemberForm.create!(
          data: params[:data],
          form_type: params[:form_type],
          country_state_id: cs,
          created_by: current_auth_user,
          device_info: params[:device_info],
          version: CustomMemberForm.latest_eminent_version,
          phone: phone_number[0],
          channel: eminent_channel
        )

        # update the user id
        params[:data][:id] = custom_member.id.to_i
        custom_member.update!(data: params[:data])

        # check if is in draft state
        if is_draft && custom_member.may_mark_incomplete?
          custom_member.mark_incomplete!
        end
        # check if form is submitted
        if !is_draft
          if params['form_step'] == 6 && custom_member.may_submit?
            custom_member.submit!
          elsif params['form_step'] < 6 && custom_member.may_mark_incomplete?
            custom_member.mark_incomplete!
          end
        end
        if is_draft
          render json: {
            success: true, data: custom_member, message: 'Member saved successfully.'
          }, status: :ok
        else
          render json: {
            success: true, message: 'Member Saved successfully.'
          }, status: :ok
        end
      else
        if edit_permission_exist.nil?
          return render json: {
            success: false,
            message: 'Access to this is restricted. Please check with the site administrator.'
          }, status: :unauthorized
        end

        if custom_member.country_state_id != cs
          return render json: {
            success: false,
            message: 'State id can not be changed.'
          }, status: :bad_request
        end

        # used for update of eminent_personality custom member form
        custom_member.update!(data: params[:data], device_info: params[:device_info], channel: eminent_channel, office_updated_at: DateTime.now)
        if is_draft && custom_member.may_mark_incomplete?
          custom_member.mark_incomplete!
        end
        if !is_draft
          if params['form_step'] == 6 && custom_member.may_submit?
            custom_member.submit!
          elsif params['form_step'] < 6 && custom_member.may_mark_incomplete?
            custom_member.mark_incomplete!
          end
        end
        if current_user.blank? || custom_member.aasm_state == 'incomplete'
          if custom_member.aasm_state == 'incomplete'
            render json: {
              success: true,
              message: 'Thank you for your response. We will let you know the status of the form soon.'
            }, status: :ok
          else
            render json: {
              success: true,
              message: 'Member Updated successfully'
            }, status: :ok
          end
        else
          render json: {
            success: true,
            message: 'Member Updated successfully'
          }, status: :ok
        end
      end
    rescue StandardError => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def add_file
    add_permission_exist = is_permissible('Eminent', 'Add')
    edit_permission_exist = is_permissible('Eminent', 'Edit')
    if add_permission_exist.nil? && edit_permission_exist.nil?
      return render json: {
        success: false,
        message: 'Access to this is restricted. Please check with the site administrator.'
      }, status: :unauthorized
    end

    require 'digest/md5'
    unless params[:file].present?
      render json: { success: false, message: 'Please provide a image file.' }, status: :bad_request
    end

    uploaded_file = params[:file]
    # Access the original filename
    file_name = uploaded_file.original_filename.present? ? uploaded_file.original_filename : nil
    file_extension = ".#{file_name.delete(' ').partition('.').last}"
    custom_file_name = Digest::MD5.hexdigest(file_name + SecureRandom.uuid.last(10).to_s) + file_extension
    url = upload_file_on_gcloud(uploaded_file, custom_file_name)
    render json: { success: true, message: 'Success', file_path: url }, status: :ok
  end

  def select_member
    begin
      permission_exist = is_permissible('Eminent', 'SelectForm')
      if permission_exist.nil?
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      custom_member = params[:id].present? ? CustomMemberForm.find_by_id(params[:id].to_i) : nil
      if custom_member.nil?
        return render json: { success: false, message: 'Please provide a valid member id' }, status: :bad_request
      end

      custom_member.is_selected = true
      custom_member.selection_reason = params[:reason].present? ? params[:reason] : nil
      custom_member.selected_by_id = current_auth_user.id
      custom_member.save!
      return render json: { success: true, message: 'Success' }, status: :ok
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def update_aasm_state
    begin
      approve_permission_exist = is_permissible?('Home', 'Freeze')
      re_edit_permission_exist = is_permissible?('Home', 'ReEdit')
      unless approve_permission_exist || re_edit_permission_exist
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end

      custom_member = params[:id].present? ? CustomMemberForm.find_by_id(params[:id].to_i) : nil
      if custom_member.nil?
        return render json: { success: true, message: 'Please provide a valid member id' }, status: :bad_request
      end

      unless ['approve', 'reject'].include? params[:aasm_state]
        return render json: { success: true, message: 'Please provide a valid aasm state.' }, status: :bad_request
      end

      if params[:aasm_state] == 'approve'
        if approve_permission_exist.nil?
          return render json: {
            success: false,
            message: 'Access to this is restricted. Please check with the site administrator.'
          }, status: :unauthorized
        end
        if custom_member.may_approve?
          custom_member.approve!
          custom_member.update(approved_by_id: current_auth_user.id)
        else
          return render json: { success: false, message: 'Transaction not allowed.' }, status: :bad_request
        end
      elsif params[:aasm_state] == 'reject'
        if re_edit_permission_exist.nil?
          return render json: {
            success: false,
            message: 'Access to this is restricted. Please check with the site administrator.'
          }, status: :unauthorized
        end
        if custom_member.may_reject?
          custom_member.reject!
          custom_member.update(
            rejection_reason: params[:reason].present? ? params[:reason] : nil,
            rejected_by_id: current_auth_user.id
          )
        else
          return render json: { success: false, message: 'Transaction not allowed.' }, status: :bad_request
        end
      end
      return render json: { success: true, message: 'Success' }, status: :ok
    rescue StandardError => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def delete_member
    begin
      unless is_permissible?('Home', 'Delete')
        return render json: {
          success: false,
          message: 'Access to this is restricted. Please check with the site administrator.'
        }, status: :unauthorized
      end
      custom_member = params[:id].present? ? CustomMemberForm.find_by_id(params[:id].to_i) : nil
      if custom_member.nil?
        return render json: { success: false, message: 'Please provide a valid member id' }, status: :bad_request
      end

      if custom_member.destroy
        custom_member.deletion_reason = params[:reason].present? ? params[:reason] : nil
        custom_member.deleted_by_id = current_auth_user.id
        custom_member.save!
      else
        return render json: { success: false, message: 'Record deletion failed! Please try later!' }, status: :bad_request
      end
      render json: { success: true, message: 'Success' }, status: :ok
    rescue StandardError => e
      return render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def list
    unless is_permissible?('Home', 'View')
      return render json: {
        success: false,
        message: 'Access to this is restricted. Please check with the site administrator.'
      }, status: :unauthorized
    end

    # compute limit and offset
    limit = params[:limit].present? ? params[:limit] : 10
    offset = params[:offset].present? ? params[:offset] : 0
    is_download = params[:offset].present? ? params[:offset] : false

    custom_members = eminent_search
    length = custom_members.length
    custom_members = custom_members.order('created_at desc')

    if !custom_members.blank?
      if is_download == true
        render json: {
          success: true,
          message: 'Success.',
          data: {
            'members': custom_members,
            'length': length
          }
        }, status: :ok
      else
        res_data = custom_members.includes(:country_state).limit(limit).offset(offset).as_json(include: [:country_state])
        res_data[0]['attached'] = 'https://www.africau.edu/images/default/sample.pdf'
        render json: {
          success: true,
          message: 'Success.',
          data: {
            'members': res_data,
            'length': length
          }
        }, status: :ok
      end
    else
      render json: { success: false, message: 'No member found.' }, status: :not_found
    end

  rescue StandardError => e
    render json: { success: false, message: e.message }, status: :bad_request
  end

  def eminent_search
    # compute search by eminent id
    custom_members = CustomMemberForm
    eminent_ids = params[:search_by_id].present? ? params[:search_by_id].split(',') : nil
    unless eminent_ids.nil?
      eminent_ids = eminent_ids.map(&:to_i)
      custom_members = custom_members.where(id: eminent_ids)
    end

    # check form type
    type = params[:type]
    unless params[:type].present? && params[:type] === CustomMemberForm::TYPE_EMINENT
      raise 'Please provide a valid form.'
    end

    # compute state id
    state_ids = params[:entry_type].present? ? params[:entry_type].split(',') : nil
    if state_ids.nil?
      state_ids = []
      fetch_user_assigned_country_states.each do |country_state|
        state_ids << country_state['id']
      end
    end
    custom_members = custom_members.where(form_type: type, country_state_id: state_ids)

    # compute channel filter
    channel = params[:channel].present? ? params[:channel].split(',') : nil
    unless channel.nil?
      custom_members = custom_members.where(channel: channel)
    end

    # compute age group filter
    age_groups = params[:age_group].present? ? params[:age_group].split(',') : nil
    unless age_groups.nil?
      age_group_query = custom_member_age_group_query(age_groups)
      custom_members = custom_members.where(age_group_query)
    end

    # compute channel filter
    form_status = params[:form_status].present? ? params[:form_status].split(',') : nil
    unless form_status.nil?
      custom_members = custom_members.where(aasm_state: form_status)
    end

    # compute education filter
    educations = params[:education].present? ? params[:education].split(',') : nil
    if educations.present?
      educations = educations.map { |element| "'#{element}'" }.join(',')
      custom_members = custom_members.where("data ->> 'educations' IS NOT NULL")
                                     .where("EXISTS(SELECT 1 FROM jsonb_array_elements(data -> 'educations') AS education
                                             WHERE (education ->> 'qualification' IN (#{educations}))
                                             AND (education ->> 'highest_qualification' = 'true'))")
    end

    # compute gender filter
    genders = params[:gender].present? ? params[:gender].split(',') : nil
    unless genders.nil?
      custom_members = custom_members.where("data->'gender' ?| array[:gender_values]", gender_values: genders)
    end

    # compute profession filter
    professions = params[:profession].present? ? params[:profession].split(',') : nil
    if professions.present?
      professions = professions.map { |element| "'#{element}'" }.join(',')
      custom_members = custom_members.where("data ->> 'professions' IS NOT NULL")
                                     .where("EXISTS(SELECT 1 FROM jsonb_array_elements(data -> 'professions') AS profession_elements
                                             WHERE (profession_elements ->> 'profession' IN (#{professions})))")
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
      custom_members = custom_members.where(search_query.join(' OR '))
    end
    custom_members
  end

  def excel_download
    custom_members = eminent_search.where.not(aasm_state: %w[pending otp_verified])
    array_attributes = %w[address educations professions election_fought other_parties political_profile political_legacy]
    hash_attributes = {
      'address' => %w[address_type flat street district state pincode],
      'educations' => %w[qualification course university college start_year end_year],
      'professions' => %w[profession position organization start_year end_year],
      'election_fought' => %w[election_type State ParliamentaryConstituency AssemblyConstituency AdministrativeDistrict urban_local_body rural_local_body election_win minister_portfolio minister_portfolio_array],
      'other_parties' => %w[party position start_year end_year],
      'political_profile' => %w[unit designation party_level start_year end_year],
      'political_legacy' => %w[name relationship profile]
    }

    sql = "SELECT array_length FROM (
                                      SELECT jsonb_array_length(jsonb_array_elements(data -> 'election_fought') -> 'election_details' -> 'minister_portfolio_array') AS array_length
                                      FROM custom_member_forms
                                      WHERE deleted_at IS NULL AND data -> 'election_fought' IS NOT NULL
                                      ORDER BY array_length DESC
                                    ) AS result_table
           WHERE array_length IS NOT NULL"
    maximum_ministry_length = custom_members.find_by_sql(sql).first&.array_length
    ministry_hash = {
      'count' => maximum_ministry_length,
      'values' => %w[ministry_name designation ministry_duration]
    }

    array_attributes_length = {}

    if custom_members.present?
      array_attributes.each do |attribute|
        array_attributes_length[attribute] = custom_members.where(Arel.sql("data ->> '#{attribute}' IS NOT NULL"))
                                                           .order(Arel.sql("jsonb_array_length(data -> '#{attribute}') DESC")).first.data[attribute].length
      end
    end

    eminent_excel_headers = eminent_headers(hash_attributes, array_attributes_length, ministry_hash)

    package = Axlsx::Package.new
    workbook = package.workbook

    workbook.add_worksheet(name: 'Eminent Download') do |sheet|
      # add headers to sheet
      sheet.add_row eminent_excel_headers
      custom_members.each do |member|
        sheet.add_row eminent_row_data(member, hash_attributes, array_attributes_length, ministry_hash), types: :string
      end
    end

    send_data package.to_stream.read, type: 'application/xlsx', filename: 'eminent_download.xlsx'
  end

  def eminent_row_data(member, hash_attributes, array_attributes_length, ministry_hash)
    row_data = []
    member_data = member.data

    row_data << member.country_state&.name
    row_data << member.id
    row_data << member_data['name']
    row_data << member_data['photo']
    row_data << member_data['gender']
    row_data << member_data['religion']
    row_data << member_data['category']
    row_data << member_data['caste']
    row_data << member_data['sub_caste']
    row_data << member_data['languages']&.join(', ')
    row_data << formatted_date_string(member_data['dob'])
    row_data << member_data['father']
    row_data << member_data['mother']
    row_data << member_data['spouse']
    row_data << member_data['children']&.join(', ')
    row_data << member_data['aadhaar']
    row_data << member_data['voter_id']
    row_data << member_data['mobiles']&.join(', ')
    row_data << member_data['std_code']
    row_data << member_data['landline']
    row_data << member_data['email']
    row_data << member_data['website']
    row_data << member_data['twitter']
    row_data << member_data['facebook']
    row_data << member_data['linkedin']
    row_data << member_data['instagram']

    array_attributes_length.each do |attribute, attribute_length|
      if attribute == 'educations'
        if member_data['educations'].present?
          result = member_data['educations'].find { |obj| obj['highest_qualification'] == true }
          row_data << (result.present? ? result['qualification'] : '')
        else
          row_data << ''
        end
      end
      attribute_length.times do |index|
        hash_attributes[attribute].each do |hash_attribute|
          if attribute == 'election_fought' && hash_attribute == 'minister_portfolio_array'
            ministry_hash['count'].times do |ministry_index|
              ministry_hash['values'].each do |value|
                if member_data[attribute].present? && member_data[attribute][index].present? && member_data[attribute][index]['election_details']['minister_portfolio_array'].present? && member_data[attribute][index]['election_details']['minister_portfolio_array'][ministry_index].present?
                  row_data << member_data[attribute][index]['election_details']['minister_portfolio_array'][ministry_index][value]
                else
                  row_data << ''
                end
              end
            end
          elsif member_data[attribute].present? && member_data[attribute][index].present?
            if attribute == 'election_fought' && %w[State ParliamentaryConstituency AssemblyConstituency AdministrativeDistrict urban_local_body rural_local_body election_win minister_portfolio].include?(hash_attribute)
              row_data << member_data[attribute][index]['election_details'][hash_attribute]
            else
              next if attribute == 'address' && hash_attribute == 'address_type' && index <= 1
              row_data << member_data[attribute][index][hash_attribute]
            end
          else
            row_data << ''
          end
        end
      end
    end
    row_data << member_data['rss_years']
    row_data << member_data['bjp_years']
    row_data << member_data['reference']['name']
    row_data << member_data['reference']['bjp_id']
    row_data << member_data['reference']['mobile']
    row_data << member_data['reference']['comments']
    row_data << member.channel
    row_data << member.aasm_state
    row_data << member.created_by&.name
    row_data << formatted_date_string((member.created_at).to_s)
    row_data
  end
end