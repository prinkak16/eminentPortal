class Api::Sync::StateController < ApplicationController
  before_action :authenticate_user
  def sync
    country_states = CountryState.select(:id, :name, :state_code).order(id: :asc)
    country_states.each do |country_state|
      fetch_state_detail = State.find_by(id: country_state[:id])
      if fetch_state_detail.nil?
        new_state = State.new(id: country_state[:id], name: country_state[:name], state_code: country_state[:state_code])
        new_state.save
      else
        update_state = State.find_by(id: country_state[:id]).update(name: country_state[:name], state_code: country_state[:state_code])
      end
    end
    render json: { success: true, message: 'Successfully synced.' }, status: 200
  end
end