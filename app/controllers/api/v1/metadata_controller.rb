class Api::V1::MetadataController < ApplicationController
  before_action :authenticate_user

  def categories
    condition = "CASE person_categories.name WHEN 'GEN' THEN '1' WHEN 'OBC' THEN '2' WHEN 'SC' THEN '3' WHEN 'ST' THEN '4' WHEN 'Minority' THEN '5' else 100 END"
    result = PersonCategory.all.order(Arel.sql(condition)).select(:id, :name)
    render json: { success: true, data: result, message: 'Categories' }, status: 200
  end

  def religions
    result = Religion.select(:id, :name)
    render json: { success: true, data: result }, status: 200
  end

  def educations
    result = PersonEducation.order(:order).select(:id, :name)
    render json: { success: true, data: result, message: 'Education List' }, status: 200
  end

  def professions
    result = PersonProfession.select(:id, :name)
    render json: { success: true, data: result, message: 'Profession List' }, status: 200
  end

  def states
    result = State.select(:id, :name).order(id: :asc)
    render json: { success: true, data: result, message: 'Profession List' }, status: 200
  end

  def state_party_list
    cs = params[:state_id].present? ? State.find_by(id: params[:state_id]) : State.find_by(name: 'Gujarat')
    parties_list = PoliticalParty.joins(:political_party_country_states)
                                 .where(political_party_country_states: { country_state_id: cs.id })
                                 .select(:id, :name, :abbreviation)
    render json: { success: true, data: parties_list, message: 'Profession List' }, status: 200
  end
end