FactoryBot.define do
  factory :post do
    title { Faker::Lorem.unique.sentence }
    description { Faker::Lorem.unique.paragraph(sentence_count: 10) }
  end
end
