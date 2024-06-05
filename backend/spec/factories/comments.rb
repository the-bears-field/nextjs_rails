FactoryBot.define do
  factory :comment do
    description { Faker::Lorem.unique.paragraph(sentence_count: 10) }
  end
end
