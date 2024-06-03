require 'rails_helper'

RSpec.describe Post, type: :model do
  let(:post) { FactoryBot.create(:post) }

  it "記事作成が正常に可能なファクトリであること" do
    expect(post).to be_valid
  end

  it "タイトルがなければ無効な状態であること" do
    post.title= nil
    post.valid?
    expect(post.errors.of_kind?(:title, :blank)).to be_truthy
  end

  it "記事の文章がなければ無効な状態であること" do
    post.description = nil
    post.valid?
    expect(post.errors.of_kind?(:description, :blank)).to be_truthy
  end
end
