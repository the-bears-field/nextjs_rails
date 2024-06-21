require 'rails_helper'

RSpec.describe Post, type: :model do
  let(:post) { FactoryBot.build(:post) }

  describe "記事の新規投稿" do
    describe "新規投稿が可能である" do
      it "記事作成が正常に可能であること" do
        expect(post).to be_valid
      end

      context "title タイトル" do
        it "先頭と末尾にスペースが存在しても、除去した上で有効な状態であること" do
          post.title = "   test   "
          post.valid?
          expect(post.title).to eq("test")
        end

        it "scriptタグを入力した場合、エスケープされた状態であること" do
          post.title = "<script>alert('test');</script>"
          post.valid?
          expect(post.title).to_not eq("<script>alert('test');</script>")
        end
      end

      context "description 文章" do
        it "先頭と末尾にスペースが存在しても、除去した上で有効な状態であること" do
          post.title = "   test test test\ntest test test\ntest   "
          post.valid?
          expect(post.title).to eq("test test test\ntest test test\ntest")
        end

        it "scriptタグを入力した場合、エスケープされた状態であること" do
          post.title = "<script>alert('hello');</script>"
          post.valid?
          expect(post.title).to_not eq("<script>alert('hello');</script>")
        end
      end
    end

    describe "新規投稿が不可能である" do
      context "title タイトル" do
        it "nilの場合、無効な状態であること" do
          post.title= nil
          post.valid?
          expect(post.errors.of_kind?(:title, :blank)).to be_truthy
        end

        it "空文字の場合、無効な状態であること" do
          post.title= ""
          post.valid?
          expect(post.errors.of_kind?(:title, :blank)).to be_truthy
        end
      end

      context "description 文章" do
        it "nilの場合、無効な状態であること" do
          post.description = nil
          post.valid?
          expect(post.errors.of_kind?(:description, :blank)).to be_truthy
        end

        it "空文字の場合、無効な状態であること" do
          post.description = ""
          post.valid?
          expect(post.errors.of_kind?(:description, :blank)).to be_truthy
        end
      end
    end
  end

end
