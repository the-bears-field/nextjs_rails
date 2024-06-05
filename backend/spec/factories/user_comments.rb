FactoryBot.define do
  factory :user_comment do
    association :user
    association :comment
  end
end
