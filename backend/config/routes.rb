Rails.application.routes.draw do
  devise_for :users
  namespace :v1 do
    resources :users, param: :user_id do
      resources :posts, param: :uuid
    end
  end
end
