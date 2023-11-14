require 'sidekiq/web'
require 'sidekiq/cron/web'
Rails.application.routes.draw do
  root "home#index"
  # Define your application modules per the DSL in https://guides.rubyonrails.org/routing.html
  mount Sidekiq::Web => "/sidekiq"

  get 'auth/callback', to: 'auth#callback'

  get "candidate_login", to: "home#candidate_login"
  get "eminent_personality", to: "home#candidate_login"
  namespace :admin do
    get 'manual_upload', to: 'admin#manual_upload'
    post 'manual_upload', to: 'admin#manual_upload_data'
  end

  namespace :api do
    namespace :v1 do
      post 'eminent_auth/send_otp', to: 'eminent_auth#send_otp'
      post 'eminent_auth/validate_otp', to: 'eminent_auth#validate_otp'

      get 'metadata/user_permissions', to: 'metadata#user_allotted_permissions'
      get 'metadata/user_allotted_states', to: 'metadata#user_allotted_states'
      get 'metadata/genders', to: 'metadata#genders'
      get 'metadata/categories', to: 'metadata#categories'
      get 'metadata/religions', to: 'metadata#religions'
      get 'metadata/educations', to: 'metadata#educations'
      get 'metadata/professions', to: 'metadata#professions'
      get 'metadata/states', to: 'metadata#states'
      get 'metadata/state_party_list', to: 'metadata#state_party_list'
      get 'metadata/get_required_locations', to: 'metadata#required_locations'

      get 'custom_member_forms/list', to: 'custom_member_form#list'
      get 'custom_member_forms/select_member', to: 'custom_member_form#select_member'
      delete 'custom_member_forms/delete_member', to: 'custom_member_form#delete_member'
      delete 'custom_member_forms/logout' => 'custom_member_form#destroy_session'
      post 'custom_member_forms/add', to: 'custom_member_form#add'
      post 'custom_member_forms/add_file', to: 'custom_member_form#add_file'
      post 'custom_member_forms/update_aasm_state', to: 'custom_member_form#update_aasm_state'
      get 'custom_member_forms/fetch_by_number', to: 'custom_member_form#fetch_by_number'

      get 'filters/home', to: 'filter#home'
      get 'filters/gom_management', to: 'filter#gom_management'
      get 'filters/master_of_vacancy', to: 'filter#master_of_vacancy'

      get 'stats/home', to: 'stats#home'

      namespace :eminent, path: 'eminent' do
        post '/auth/send_otp', to: 'eminent_auth#send_otp'
        post '/auth/validate_otp', to: 'eminent_auth#validate_otp'
        get '/fetch', to: 'eminent#fetch_eminent'
        post '/update', to: 'eminent#update_eminent'
        delete '/logout', to: 'eminent#logout'

        post 'add_file', to: 'eminent#add_file'

        get '/metadata/genders', to: 'metadata#genders'
        get '/metadata/categories', to: 'metadata#categories'
        get '/metadata/religions', to: 'metadata#religions'
        get '/metadata/educations', to: 'metadata#educations'
        get '/metadata/professions', to: 'metadata#professions'
        get '/metadata/states', to: 'metadata#states'
        get '/metadata/state_party_list', to: 'metadata#state_party_list'
        get '/metadata/get_required_locations', to: 'metadata#required_locations'
      end

      namespace :gom, path: 'gom' do
        get '/minister_list', to: 'gom#minister_list'
        get '/assigned_ministries', to: 'gom#search_assigned_ministries'
        get '/assigned_ministries_by_filters', to: 'gom#assigned_ministries_by_filters'
      end

      namespace :vacancy, path: 'vacancy' do
        post '/manual_upload', to: 'upload#manual_upload'
        get '/position_analytics', to: 'vacancy#position_analytics'
        get '/vacant_overview/by_state', to: 'vacancy#vacant_overview_by_state'
        get '/list/by_ministry', to: 'vacancy#list_by_ministry'
      end

      namespace :user, path: 'user' do
        post '/manual_upload/minister_assistant_mapping', to: 'user#upload_minister_assistant_mapping'
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