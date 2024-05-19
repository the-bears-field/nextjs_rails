FactoryBot.define do
  factory :post do
    sequence(:title) { |n| "title-#{n}" }
    sequence(:description) { |n| "description-#{n}" }
  end
end
