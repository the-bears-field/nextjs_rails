FactoryBot.define do
  factory :user do
    user_id { Faker::Internet.username(specifier: 4..15, separators: %w(_)) }
    name { Faker::Internet.unique.username }
    email { Faker::Internet.unique.email(domain: 'example.com') }
    password { 'Password1234!' }
    password_confirmation { 'Password1234!' }

    # ユーザーと紐づいた投稿を生成
    trait :with_posts do
      after(:create) { |user|
        create_associated_records(
          main_factory: user,
          associated_factory_symbol: :post,
          count: 3
        )
      }
    end

    # ユーザーと紐づいたタグ付済み投稿を生成
    trait :with_posts_and_tags do
      after(:create) { |user|
        create_associated_records(
          main_factory: user,
          associated_factory_symbol: :post,
          associated_factory_traits: [:with_tags],
          count: 3
        )
      }
    end
  end
end
