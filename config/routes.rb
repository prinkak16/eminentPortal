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

      namespace :user, path: 'user' do
        get '/minister_list', to: 'user#minister_list'
        get '/assigned_ministries', to: 'user#user_assigned_ministries'
      end
      namespace :user, path: 'user/:user_id' do
        get '/assigned_ministries', to: 'user#assigned_ministries'
        post '/assign_ministries', to: 'user#assign_ministries'
        delete '/dissociate_ministries', to: 'user#dissociate_ministries'
        get '/allocated_ministries', to: 'user#allocated_ministries'
        post '/allocate_ministries', to: 'user#allocate_ministries'
        delete '/deallocate_ministries', to: 'user#deallocate_ministries'
      end

      get 'ministry', to: 'ministry#get_ministries'
      post 'ministry', to: 'ministry#add_ministry'
      get 'ministry/:ministry_id', to: 'ministry#get_ministry'

      namespace :ministry, path: 'ministry/:ministry_id' do
        post '/department', to: 'department#add_department'
        get '/department', to: 'department#get_departments'
        get '/department/:department_id', to: 'department#get_department'

        namespace :department, path: 'department/:department_id' do
          post '/organization', to: 'organization#add_organization'
          get '/organization', to: 'organization#get_organizations'
          get '/organization/:organization_id', to: 'organization#get_organization'
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
