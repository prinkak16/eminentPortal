# frozen_string_literal: true
class Api::V1::FileStatus::FileStatusController < BaseApiController
  include ApplicationHelper
  def analytics
    permission_exist = is_permissible('Eminent', 'FileStatus')
    if permission_exist.nil?
      return render json: {
        success: false,
        message: 'Access to this is restricted. Please check with the site administrator.'
      }, status: :unauthorized
    end

    stats = {
      'total_persons': 0,
      'in_progress': 0,
      'dropped': 0,
      'verified': 0,
    }

    puts "dsbcjdh #{current_auth_user.id}"
    assigned_ministries_ids = current_auth_user.assigned_ministry.pluck(:ministry_id)
    result = CustomMemberForm
               .joins(vacancy_allotments: [{ file_status: :file_status_level }, :vacancy])
               .where(vacancy_allotments: { unoccupied_at: nil }, vacancy: { ministry_id: assigned_ministries_ids })
               .group("file_status_levels.state")
               .count

    total_count = 0
    if result.present?
      stats[:in_progress] = result['In Progress'] + result['Pending'] || 0
      stats[:dropped] = result['Rejected'] || 0
      stats[:verified] = result['Verified'] || 0
      stats.each do |s, c|
        total_count += c
      end
    end
    stats[:total_persons] = total_count

    render json: { message: 'Analytics list', data: stats, status: true }, status: :ok
  rescue StandardError => e
    render json: { message: e.message }, status: :bad_request
  end

  def file_status_members
    permission_exist = is_permissible('Eminent', 'FileStatus')
    if permission_exist.nil?
      return render json: {
        success: false,
        message: 'Access to this is restricted. Please check with the site administrator.'
      }, status: :unauthorized
    end

    offset = params[:offset]
    member_name = params[:name]
    member_id = params[:id]
    ministry_id = params[:ministry_ids]
    fs_level_id = params[:file_status_ids]
    psu_psb_id = params[:organization]

    raise StandardError, 'Offset is required' if offset.nil?

    limit = params[:limit].present? ? params[:limit] : 10
    custom_forms = CustomMemberForm.joins(vacancy_allotments: %i[file_status vacancy]).where(vacancy_allotments: { unoccupied_at: nil })
    assigned_ministries_ids = current_auth_user.assigned_ministry.pluck(:ministry_id)
    custom_forms = custom_forms.where(vacancy: { ministry_id: assigned_ministries_ids})
    custom_forms = custom_forms.where("LOWER(data->>'name') LIKE ?", "%#{member_name.downcase}%") if member_name.present?
    custom_forms = custom_forms.where("CAST(custom_member_forms.id AS TEXT) LIKE ?", "%#{member_id}%") if member_id.present?
    custom_forms = custom_forms.where(vacancy: { ministry_id: ministry_id.split(',') }) if ministry_id.present?
    custom_forms = custom_forms.where(vacancy: { organization_id: psu_psb_id.split(',') }) if psu_psb_id.present?
    custom_forms = custom_forms.where(file_status: { file_status_level_id: fs_level_id.split(',') }) if fs_level_id.present?
    total_count = custom_forms.count
    data = custom_forms.offset(offset).limit(limit).map do |member|
      m_relations = member.vacancy_allotments&.where(unoccupied_at: nil).first
      {
        id: member.id,
        name: member.data&.dig('name'),
        mobiles: member.data&.dig('mobiles'),
        photo: member.data&.dig('photo'),
        ministry: m_relations&.vacancy&.ministry&.name,
        psu: m_relations&.vacancy&.organization&.name,
        type: m_relations&.vacancy&.organization&.ratna_type,
        file_status: get_last_file_status(m_relations&.id),
        file_state: get_last_file_state(m_relations&.id) || 'Pending',
        file_history: file_history(m_relations&.file_status&.id),
        fs_id: m_relations&.file_status&.id
      }
    end
    render json: { message: 'Allotted files list', data: data, total_eminent: total_count, status: true }, status: :ok
  rescue StandardError => e
    render json: { message: e.message }, status: :bad_request
  end

  def update_status
    permission_exist = is_permissible('Eminent', 'FileStatus')
    if permission_exist.nil?
      return render json: {
        success: false,
        message: 'Access to this is restricted. Please check with the site administrator.'
      }, status: :unauthorized
    end

    fs_id = params[:fs_id]
    fs_description = params[:fs_description]
    fs_level_id = params[:fs_level_id]
    raise StandardError, 'File Status is required' if fs_id.nil?
    raise StandardError, 'File Status level is required' if fs_level_id.nil?

    file_status = FileStatus.find_by(id: fs_id)
    raise StandardError, 'File Status id is invalid' if file_status.nil?

    file_status.file_status_level_id = fs_level_id
    file_status.description = fs_description
    file_status.action_by = current_auth_user
    file_status.save

    fs_a = FileStatusActivity.new
    fs_a.file_status = file_status
    fs_a.vacancy_allotment_id = file_status.vacancy_allotment_id
    fs_a.file_status_level_id = fs_level_id
    fs_a.description = fs_description
    fs_a.save
    render json: { message: 'File status update successfully', status: true }, status: :ok
  rescue StandardError => e
    render json: { message: e.message }, status: :bad_request
  end

  def file_history(fs_id)
    FileStatusActivity.joins(:file_status_level).where(file_status_id: fs_id).order(created_at: :asc).map do |hs|
      { status: hs.file_status_level.name, updated_at: hs.created_at.in_time_zone('Asia/Kolkata').strftime('%a %b %d %Y %I:%M %p') }
    end
  end

  def get_last_file_status(va_id)
    FileStatus.joins(:file_status_level).where(vacancy_allotment_id: va_id).select('file_status_levels.name as status,file_status_levels.id as status_id, file_status.description as description').first
  end

  def get_last_file_state(va_id)
    FileStatus.where(vacancy_allotment_id: va_id).order(created_at: :desc).first&.file_status_level&.state
  end
  def file_status_levels
    permission_exist = is_permissible('Eminent', 'FileStatus')
    if permission_exist.nil?
      return render json: {
        success: false,
        message: 'Access to this is restricted. Please check with the site administrator.'
      }, status: :unauthorized
    end

    file_statuses = get_file_status_levels.where.not(name: "Pending")
    render json: { status: true, data: file_statuses, message: 'File Statuses' }, status: :ok
  end


end

