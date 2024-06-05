require 'rails_helper'

RSpec.describe Tag, type: :model do
  let(:tag) { FactoryBot.build(:tag) }

  describe "タグの新規投稿" do
    describe "新規投稿が可能である" do
      it "タグ名が有効な状態であること" do
        expect(tag).to be_valid
      end
    end

    describe "新規投稿が不可能である" do
      context "name 名前" do
        it "nilの場合、無効な状態であること" do
          tag.name = nil
          tag.valid?
          expect(tag.errors.of_kind?(:name, :blank)).to be_truthy
        end

        it "空文字の場合、無効な状態であること" do
          tag.name = ""
          tag.valid?
          expect(tag.errors.of_kind?(:name, :blank)).to be_truthy
        end

        it "重複しない状態であること" do
          FactoryBot.create(:tag, name: "example")
          tag.name = "example"
          tag.valid?
          expect(tag.errors.of_kind?(:name, :taken)).to be_truthy
        end
      end
    end
  end


end
