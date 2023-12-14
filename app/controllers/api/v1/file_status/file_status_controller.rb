# frozen_string_literal: true
class Api::V1::FileStatus::FileStatusController < BaseApiController

  def analytics
    stats = {
      'total_persons': 0,
      'in_progress': 0,
      'dropped': 0,
      'verified': 0,
    }

    result = CustomMemberForm.joins(vacancy_allotments: [{ file_status: :file_status_level }, :vacancy])
                             .where(vacancy_allotments: { unoccupied_at: nil })
                             .group("file_status_levels.state")
                             .count

    total_count = 0
    if result.present? && result[0].present?
      stats[:in_progress] = result['In Progress'] || 0
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
    offset = params[:offset]
    raise StandardError, 'Offset is required' if offset.nil?

    limit = params[:limit].present? ? params[:limit] : 10
    custom_forms = CustomMemberForm
    data = custom_forms.joins(vacancy_allotments: %i[file_status vacancy])
                       .where(vacancy_allotments: { unoccupied_at: nil })
                       .offset(offset).limit(limit).map do |member|
      m_relations = member.vacancy_allotments&.first
      {
        id: member.id,
        name: member.data&.dig('name'),
        mobiles: member.data&.dig('mobiles'),
        photo: member.data&.dig('photo'),
        ministry: m_relations&.vacancy&.ministry&.name,
        psu: m_relations&.vacancy&.organization&.name,
        type: m_relations&.vacancy&.organization&.type,
        file_status: get_last_file_status(m_relations&.id),
        file_state: get_last_file_state(m_relations&.id),
        file_history: file_history(m_relations&.file_status&.id)
      }
    end
    render json: { message: 'Allotted files list', data: data, status: true }, status: :ok
  rescue StandardError => e
    render json: { message: e.message }, status: :bad_request
  end

  def update_status
    va_id = params[:vacancy_allotment_id]
    status = params[:file_status]
    raise StandardError, 'Vacancy Allotment id form is required' if va_id.nil?
    raise StandardError, 'File Status is required' if status.nil?

    v_a = VacancyAllotment.find_by(id: va_id)
    raise StandardError, 'Vacancy Allotment id is invalid' if v_a.nil?

    f_a = FileStatus
    f_a.vacancy_allotment_id = va_id
    f_a.file_status = status
    f_a.action_by = current_user
    render json: { message: 'File status update successfully', status: true }, status: :ok
  rescue StandardError => e
    render json: { message: e.message }, status: :bad_request
  end

  def file_history(fs_id)
    FileStatusActivity.joins(:file_status_level).where(file_status_id: fs_id).map do |hs|
      { status: hs.file_status_level.name, updated_at: hs.created_at.strftime('%a %b %d %Y %I:%M:%S %p') }
    end
  end

  def get_last_file_status(va_id)
    FileStatus.joins(:file_status_level).where(vacancy_allotment_id: va_id).select('file_status_levels.name as status, file_status.description as description').first
  end

  def get_last_file_state(va_id)
    FileStatus.where(vacancy_allotment_id: va_id).order(created_at: :desc).first&.file_status_level&.state
  end
  def file_status_levels
    file_statuses = FileStatusLevel.all.select(:id,:name)
    render json: {status: true, data: file_statuses, message: 'File Statuses'}, status: :ok
  end
end

