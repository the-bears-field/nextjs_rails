FactoryBot.define do
  factory :user do
      name { 'John Doe' }
      email { 'test@example.com' }
      password { 'password' }
  end
end
