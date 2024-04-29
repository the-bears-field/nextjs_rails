require 'rails_helper'

RSpec.describe User, type: :model do
  # ユーザー名、メール、パスワードが有効な状態であること
  it "is valid with a user name, email, and password" do
    user = User.new(
      name: 'John Doe',
      email: 'test@example.com',
      password_digest: 'password'
    )
    expect(user).to be_valid
  end

  # ユーザー名がなければ無効な状態であること
  it "is invalid without a user name" do
    user = User.new(
      name: nil,
      email: 'test@example.com',
      password_digest: 'password'
    )
    user.valid?
    expect(user.errors[:name]).to include("can't be blank")
  end

  # メールアドレスがなければ無効な状態であること
  it "is invalid without an email address" do
    user = User.new(
      name: 'John Doe',
      email: nil,
      password_digest: 'password'
    )
    user.valid?
    expect(user.errors[:email]).to include("can't be blank")
  end

  # 重複したメールアドレスなら無効な状態であること
  it "is invalid with a duplicate email address" do
    User.create(
      name: 'John Doe',
      email: 'test@example.com',
      password_digest: 'password'
    )

    user = User.new(
      name: 'John Doe',
      email: 'test@example.com',
      password_digest: 'password'
    )

    user.valid?
    expect(user.errors[:email]).to include("has already been taken")
  end
end