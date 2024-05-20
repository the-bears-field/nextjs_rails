require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { FactoryBot.create(:user) }

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
    user1 = FactoryBot.create(:user)
    user2 = FactoryBot.create(:user)
    expect(true).to eq(true)
  end
end
