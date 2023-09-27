require 'sidekiq/web'
require 'sidekiq/cron/web'
Rails.application.routes.draw do
  root "home#index"
  # Define your application modules per the DSL in https://guides.rubyonrails.org/routing.html
  mount Sidekiq::Web => "/sidekiq"

  get 'auth/callback', to: 'auth#callback'

  namespace :api do
    namespace :v1 do
      get 'metadata/categories', to: 'metadata#categories'
      get 'metadata/religions', to: 'metadata#religions'
      get 'metadata/educations', to: 'metadata#educations'
      get 'metadata/professions', to: 'metadata#professions'
      get 'metadata/states', to: 'metadata#states'
      get 'metadata/state_party_list', to: 'metadata#state_party_list'
      post 'custom_member_forms/add', to: 'custom_member_form#add'
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
