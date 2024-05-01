require 'rails_helper'

RSpec.describe Comment, type: :model do
  # コメントの文章が有効な状態であること
  it "is valid with a comment description" do
    comment = Comment.new(description: 'description')
    expect(comment).to be_valid
  end

  # コメントの文章がなければ無効な状態であること
  it "is valid without a tag name" do
    comment = Comment.new(description: nil)
    comment.valid?
    expect(comment.errors[:description]).to include("can't be blank")
  end
end
