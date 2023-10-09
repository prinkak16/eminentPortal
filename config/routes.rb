require 'sidekiq/web'
require 'sidekiq/cron/web'
Rails.application.routes.draw do
  root "home#index"
  # Define your application modules per the DSL in https://guides.rubyonrails.org/routing.html
  mount Sidekiq::Web => "/sidekiq"

  get 'auth/callback', to: 'auth#callback'

  namespace :api do
    namespace :v1 do
      get 'metadata/user_allotted_states', to: 'metadata#user_allotted_states'
      get 'metadata/genders', to: 'metadata#genders'
      get 'metadata/categories', to: 'metadata#categories'
      get 'metadata/religions', to: 'metadata#religions'
      get 'metadata/educations', to: 'metadata#educations'
      get 'metadata/professions', to: 'metadata#professions'
      get 'metadata/states', to: 'metadata#states'
      get 'metadata/state_party_list', to: 'metadata#state_party_list'
      post 'custom_member_forms/send_otp', to: 'custom_member_form#send_otp'
      post 'custom_member_forms/validate_otp', to: 'custom_member_form#validate_otp'
      post 'custom_member_forms/add', to: 'custom_member_form#add'
      post 'custom_member_forms/add_file', to: 'custom_member_form#add_file'
      get 'custom_member_forms/select_member', to: 'custom_member_form#select_member'
      post 'custom_member_forms/update_aasm_state', to: 'custom_member_form#update_aasm_state'
      get 'custom_member_forms/delete_member', to: 'custom_member_form#delete_member'
    end
    namespace :sync do
      get 'states', to: 'state#sync'
    end
  end
  #noinspection RailsParamDefResolve
  match '*path', to: 'home#index', via: :all, constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }
end
