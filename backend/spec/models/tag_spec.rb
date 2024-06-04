require 'rails_helper'

RSpec.describe Tag, type: :model do
  let(:tag) { FactoryBot.build(:tag) }

  it "タグ名が有効な状態であること" do
    expect(tag).to be_valid
  end

  it "タグ名がなければ無効な状態であること" do
    tag.name = nil
    tag.valid?
    expect(tag.errors.of_kind?(:name, :blank)).to be_truthy
  end

  it "タグ名が重複しない状態であること" do
    FactoryBot.create(:tag, name: "example")
    tag.name = "example"
    tag.valid?
    expect(tag.errors.of_kind?(:name, :taken)).to be_truthy
  end
end
