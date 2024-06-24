require 'rails_helper'

RSpec.describe Comment, type: :model do
  let(:comment) { FactoryBot.build(:comment) }

  describe "コメントの新規投稿" do
    describe "新規投稿が可能である" do
      it "コメントの文章が有効な状態であること" do
        expect(comment).to be_valid
      end

      context "description 文章" do
        it "先頭と末尾にスペースが存在しても、除去した上で有効な状態であること" do
          comment.description = "   test test test\ntest test test\ntest   "
          comment.valid?
          expect(comment.description).to eq("test test test\ntest test test\ntest")
        end

        it "scriptタグを入力した場合、エスケープされた状態であること" do
          comment.description = "<script>alert('hello');</script>"
          comment.valid?
          expect(comment.description).to_not eq("<script>alert('hello');</script>")
        end
      end
    end

    describe "新規投稿が不可能である" do
      context "description 文章" do
        it "nilの場合、無効な状態であること" do
          comment.description = nil
          comment.valid?
          expect(comment.errors.of_kind?(:description, :blank)).to be_truthy
        end

        it "空文字の場合、無効な状態であること" do
          comment.description = ""
          comment.valid?
          expect(comment.errors.of_kind?(:description, :blank)).to be_truthy
        end
      end
    end
  end

end
