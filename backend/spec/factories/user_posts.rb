FactoryBot.define do
  factory :user_post do
      association :user
      association :post
  end
end
