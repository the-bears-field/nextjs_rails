FactoryBot.define do
  factory :post do
    title { Faker::Lorem.unique.sentence }
    description { Faker::Lorem.unique.paragraph(sentence_count: 10) }

    # 投稿と紐づいたタグを生成
    trait :with_tags do
      after(:create) { |post|
        create_associated_records(
          main_factory: post,
          associated_factory_symbol: :tag,
          count: 10
        )
      }
    end
  end
end
