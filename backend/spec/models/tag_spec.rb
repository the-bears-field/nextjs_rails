require 'rails_helper'

RSpec.describe Tag, type: :model do
  # タグ名が有効な状態であること
  it "is valid with a tag name" do
    tag = Tag.new(name: 'example')
    expect(tag).to be_valid
  end

  # タグ名がなければ無効な状態であること
  it "is valid without a tag name" do
    tag = Tag.new(name: nil)
    tag.valid?
    expect(tag.errors[:name]).to include("can't be blank")
  end

  # タグ名が重複しない状態であること
  it "is invalid with a duplicate tag name" do
    Tag.create(name: "example")
    tag = Tag.new(name: "example")
    tag.valid?
    expect(tag.errors[:name]).to include("has already been taken")
  end
end
