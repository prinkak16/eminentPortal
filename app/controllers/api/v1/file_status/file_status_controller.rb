# frozen_string_literal: true
class Api::V1::FileStatus::FileStatusController < BaseApiController

  def analytics
    stats = {
      'total_persons': 0,
      'in_progress': 0,
      'dropped': 0,
      'verified': 0,
    }

    # total_persons = VacancyAllotment.where.not(unoccupied_at: nil).count
    # total_persons = VacancyAllotment.where.not(unoccupied_at: nil).count

    sql_query = <<~SQL
      SELECT
                    fs.*,
                    COUNT(CASE WHEN fs.file_status = 'dropped' THEN 1 ELSE NULL END) AS count_dropped,
                    COUNT(CASE WHEN fs.file_status = 'verified' THEN 1 ELSE NULL END) AS count_verified
                  FROM
                    file_status fs
                  JOIN (
                    SELECT
                      vacancy_allotment_id,
                      MAX(created_at) AS max_created_at
                    FROM
                      file_status
                    GROUP BY
                      vacancy_allotment_id
                  ) latest ON fs.vacancy_allotment_id = latest.vacancy_allotment_id
                         AND fs.created_at = latest.max_created_at
                  GROUP BY
                        fs.id;
    SQL

    result = ActiveRecord::Base.connection.execute(sql_query).map(&:symbolize_keys)

    if result.present? && result[0].present?
      stats[:total_persons] = result[0]['total_persons'] || 0
      stats[:in_progress] = result[0]['in_progress'] || 0
      stats[:dropped] = result[0]['dropped'] || 0
      stats[:verified] = result[0]['verified'] || 0
    end
  end

  def file_status_members
    offset = params[:offset]
    raise StandardError, 'Offset is required' if offset.nil?

    limit = params[:limit].present? ? params[:limit] : 10
    custom_forms = CustomMemberForm
    data = custom_forms.joins(vacancy_allotments: %i[file_statuses vacancy])
                       .where(vacancy_allotments: { unoccupied_at: nil })
                       .offset(offset).limit(limit).map do |member|
      {
        id: member.id,
        name: member.data&.dig('name'),
        mobiles: member.data&.dig('mobiles'),
        photo: member.data&.dig('photo'),
        ministry: member.vacancy_allotments&.vacancy&.ministry&.name,
        psu: member.vacancy_allotments&.vacancy&.organization&.name,
        type: member.vacancy_allotments&.vacancy&.organization&.type,
        status: get_last_file_status(member.vacancy_allotments&.id),
        file_history: file_history(member.vacancy_allotments&.id)
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

  def file_history(va_id)
    FileStatus.where(vacancy_allotment_id: va_id)
              .select(:status, :updated_at)
              .map do |file_status|
      { status: file_status.status, updated_at: file_status.created_at.strftime('%a %b %d %Y %I:%M:%S %p') }
    end
  end

  def get_last_file_status(va_id)
    FileStatus.where(vacancy_allotment_id: va_id).order(created_at: :desc).first&.file_status
  end
end

