FactoryBot.define do
  factory :user do
    name { Faker::Internet.unique.username }
    email { Faker::Internet.unique.email(domain: 'example.com') }
    password { 'password' }
  end
end
