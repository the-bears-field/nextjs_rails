Rails.application.routes.draw do
  get 'users/index'
  get 'users/show'
  get 'users/new'
  post 'users/create'
  get 'users/edit'
  post 'users/update'
  get 'users/destory'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
