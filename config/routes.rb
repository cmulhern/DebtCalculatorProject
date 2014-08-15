Rails.application.routes.draw do
  
  resources :debts
  root :to => redirect('/debts')
  
end
