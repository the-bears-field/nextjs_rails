FactoryBot.define do
  factory :post_comment do
    association :post
    association :comment
  end
end
