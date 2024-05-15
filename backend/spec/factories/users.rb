FactoryBot.define do
  factory :user do
      name { 'John Doe' }
      sequence(:email) { |n| "test#{n}@example.com" }
      password { 'password' }
  end
end
