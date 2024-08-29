Rails.application.routes.draw do
  devise_for :users, path: 'v1/users', module: 'v1/users'

  namespace :v1 do
    resources :users, param: :user_id do
      resources :posts, param: :uuid
    end
  end
end
