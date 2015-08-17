Rails.application.routes.draw do

  root 'pages#index'

  resources :users, only: [:index, :new, :create, :show] do
    member do
      get 'notify', to: 'users#notify'
      post 'add', to: 'friendships#create'
      post 'accept', to: 'friendships#accept'
      patch 'update_avatar', to: 'users#update_avatar'
    end

    collection do
      post 'create_with_particle', to: 'users#create_with_particle'
    end

    resources :trackers, only: [:index, :create, :destroy] do
      member do
        get 'test', to: 'trackers#test'
      end

      collection do
        get 'sign_in_with_particle', to: 'trackers#modal_index'
        post 'authenticate', to: 'trackers#authenticate'
      end
    end

    resources :friendships, only: [:destroy]
    resources :stats, only: [:index, :create, :show]
    get 'test', to: 'stats#new'
  end

  resources :user_sessions, only: :create
  get 'login', to: 'user_sessions#new', as: :login
  get 'logout', to: 'user_sessions#destroy', as: :logout

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
