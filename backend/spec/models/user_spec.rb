require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { FactoryBot.build(:user) }
  let(:user_with_posts) { FactoryBot.create(:user, :with_posts) }
  let(:user_with_posts_and_tags) { FactoryBot.create(:user, :with_posts_and_tags) }

  it "ユーザー名、メール、パスワードが有効なファクトリを持つこと" do
    expect(user).to be_valid
  end

  it "ユーザー名がなければ無効な状態であること" do
    user.name = nil
    user.valid?
    expect(user.errors.of_kind?(:name, :blank)).to be_truthy
  end

  it "メールアドレスがなければ無効な状態であること" do
    user.email = nil
    user.valid?
    expect(user.errors.of_kind?(:email, :blank)).to be_truthy
  end

  it "重複したメールアドレスなら無効な状態であること" do
    FactoryBot.create(:user, email: 'aaa@example.com')
    user = FactoryBot.build(:user, email: 'aaa@example.com')
    user.valid?
    expect(user.errors.of_kind?(:email, :taken)).to be_truthy
  end

  it "複数のユーザーで何かする" do
    user1 = FactoryBot.build(:user)
    user2 = FactoryBot.build(:user)
    expect(true).to eq(true)
  end

  context ':with_posts' do
    it 'ユーザーと紐づいた投稿が3つ作成されている' do
      expect(user_with_posts.posts.size).to eq(3)
    end
  end

  context ':with_posts_and_tags' do
    it 'ユーザーと紐づいた投稿が3つ作成、かつ各々の投稿に10個タグ付けされている' do
      expect(user_with_posts_and_tags.posts.size).to eq(3)
      user_with_posts_and_tags.posts.each do |post|
        expect(post.tags.size).to eq(10)
      end
    end
  end
end
