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
      get 'metadata/config/home', to: 'metadata#config_home'
      get 'custom_member_forms/list', to: 'custom_member_form#list'
      get 'custom_member_forms/select_member', to: 'custom_member_form#select_member'
      get 'custom_member_forms/delete_member', to: 'custom_member_form#delete_member'
      post 'custom_member_forms/send_otp', to: 'custom_member_form#send_otp'
      post 'custom_member_forms/validate_otp', to: 'custom_member_form#validate_otp'
      post 'custom_member_forms/add', to: 'custom_member_form#add'
      post 'custom_member_forms/add_file', to: 'custom_member_form#add_file'
      post 'custom_member_forms/update_aasm_state', to: 'custom_member_form#update_aasm_state'

      get 'ministry', to: 'ministry#get_ministries'
      post 'ministry', to: 'ministry#add_ministry'
      get 'ministry/:ministry_id', to: 'ministry#get_ministry'

      namespace :ministry, path: 'ministry/:ministry_id' do
        post '/department', to: 'department#add_department'
        get '/department', to: 'department#get_departments'
        get '/department/:department_id', to: 'department#get_department'

        namespace :department, path: 'department/:department_id' do
          post '/organization', to: 'organization#add_organization'
        end
      end
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
