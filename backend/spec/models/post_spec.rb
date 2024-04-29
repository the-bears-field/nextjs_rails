require 'rails_helper'

RSpec.describe Post, type: :model do
  # 記事作成が正常に可能であること
  it "is valid with a title, description" do
    post = Post.new(
      title: 'title',
      description: 'description'
    )
    expect(post).to be_valid
  end

  # タイトルがなければ無効な状態であること
  it "is invalid without a title" do
    post = Post.new(
      title: nil,
      description: 'description'
    )
    post.valid?
    expect(post.errors[:title]).to include("can't be blank")
  end

  # 記事の文章がなければ無効な状態であること
  it "is invalid without a description" do
    post = Post.new(
      title: 'title',
      description: nil
    )
    post.valid?
    expect(post.errors[:description]).to include("can't be blank")
  end
end
