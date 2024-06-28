require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { FactoryBot.build(:user) }
  let(:user_with_posts) { FactoryBot.create(:user, :with_posts) }
  let(:user_with_posts_and_tags) { FactoryBot.create(:user, :with_posts_and_tags) }

  describe "ユーザーの新規登録" do
    describe "新規登録が可能である" do
      it "ユーザー名、ユーザーID、メール、パスワードが有効なファクトリを持つこと" do
        expect(user).to be_valid
      end

      context "user_id ユーザーID" do
        it "定められた書式である場合、有効な状態であること" do
          user.user_id = "__Example1234__"
          user.valid?
          expect(user).to be_valid
        end
      end

      context "biography プロフィール文" do
        it "scriptタグを入力した場合、エスケープされた状態であること" do
          user.biography = "<script>alert('Hello');</script>"
          user.valid?
          expect(user.biography).to_not eq("<script>alert('Hello');</script>")
        end

        it "nilを代入した場合、空文字に代替された状態であること" do
          user.biography = nil
          user.valid?
          expect(user.biography).to eq("")
        end
      end

      context "name 名前" do
        it "名前の先頭と末尾にスペースが存在しても、除去した上で有効な状態であること" do
          user.name = "   example test     "
          user.valid?
          expect(user.name).to eq("example test")
        end

        it "scriptタグを入力した場合、エスケープされた状態であること" do
          user.name = "<script>alert('Hello');</script>"
          user.valid?
          expect(user.name).to_not eq("<script>alert('Hello');</script>")
        end
      end

      context "email メール, normalized_email 正規化したメール" do
        it "メールアドレスの書式である場合、有効な状態であること" do
          user.email = "example@example.co.jp"
          user.valid?
          expect(user).to be_valid
        end

        it "Gmailでの登録で、検証を経て正規化されたメールアドレスが有効な状態であること" do
          user.email = "ex.amp.le+test@gmail.com"
          user.valid?
          expect(user.normalized_email).to eq("example@gmail.com")
        end

        it "Googlemailの登録で、検証を経て正規化されたメールアドレスが有効な状態であること" do
          user.email = "ex.amp.le+test@googlemail.com"
          user.valid?
          expect(user.normalized_email).to eq("example@googlemail.com")
        end
      end

      it "複数のユーザーで何かする" do
        user1 = FactoryBot.build(:user)
        user2 = FactoryBot.build(:user)
        expect(true).to eq(true)
      end

      context ':with_posts' do
        it 'ユーザーと紐づいた投稿が3つ作成されている' do
          expect(user_with_posts.posts.size).to eq(3)
        end
      end

      context ':with_posts_and_tags' do
        it 'ユーザーと紐づいた投稿が3つ作成、かつ各々の投稿に10個タグ付けされている' do
          expect(user_with_posts_and_tags.posts.size).to eq(3)
          user_with_posts_and_tags.posts.each do |post|
            expect(post.tags.size).to eq(10)
          end
        end
      end
    end
  end

  describe "新規登録が不可能である" do
    context "user_id ユーザーID" do
      it "nilの場合、無効な状態であること" do
        user.user_id = nil
        user.valid?
        expect(user.errors.of_kind?(:user_id, :blank)).to be_truthy
      end

      it "空文字の場合、無効な状態であること" do
        user.user_id = ""
        user.valid?
        expect(user.errors.of_kind?(:user_id, :blank)).to be_truthy
      end

      it "定められた書式ではない場合、無効な状態であること" do
        user.user_id = "!@#$%^&*()-="
        user.valid?
        expect(user).to be_invalid
      end

      it "4文字未満の場合、無効な状態であること" do
        user.user_id = "x"
        user.valid?
        expect(user).to be_invalid
      end

      it "16文字以上の場合、無効な状態であること" do
        user.user_id = "__Example12345678__"
        user.valid?
        expect(user).to be_invalid
      end
    end

    context "name 名前" do
      it "nilの場合、無効な状態であること" do
        user.name = nil
        user.valid?
        expect(user.errors.of_kind?(:name, :blank)).to be_truthy
      end

      it "空文字の場合、無効な状態であること" do
        user.name = ""
        user.valid?
        expect(user.errors.of_kind?(:name, :blank)).to be_truthy
      end
    end

    context "email メール" do
      it "nilの場合、無効な状態であること" do
        user.email = nil
        user.valid?
        expect(user.errors.of_kind?(:email, :blank)).to be_truthy
      end

      it "空文字の場合、無効な状態であること" do
        user.email = ""
        user.valid?
        expect(user.errors.of_kind?(:email, :blank)).to be_truthy
      end

      it "メールアドレスの書式ではない場合、無効な状態であること" do
        user.email = "example"
        user.valid?
        expect(user).to be_invalid
      end

      it "正規表現での定義外の文字列が含まれていた場合、無効な状態であること" do
        user.email = "<script>alert('test');</script>@example.com"
        user.valid?
        expect(user).to be_invalid
      end

      it "重複したメールアドレスなら無効な状態であること" do
        FactoryBot.create(:user, email: "aaa@example.com")
        user.email = "aaa@example.com"
        user.valid?
        expect(user.errors.of_kind?(:email, :taken)).to be_truthy
      end

      it "エイリアスを含むGmailでの登録で、ユーザー名とドメインが一致した場合は無効" do
        FactoryBot.create(:user, email: "example@gmail.com")
        user.email = "example+test@gmail.com"
        user.valid?
        expect(user.errors.of_kind?(:normalized_email, :taken)).to be_truthy
      end

      it "Googlemailでの登録で、Gmailに同じユーザー名が登録済だった場合は無効" do
        FactoryBot.create(:user, email: "example@gmail.com")
        user.email = "example@googlemail.com"
        user.valid?
        expect(user.errors.of_kind?(:normalized_email, :taken)).to be_truthy
      end
    end

    context "password パスワード" do
      it "パスワードが8文字未満の場合は無効" do
        user.password = "test"
        user.valid?
        expect(user.errors.of_kind?(:password, :too_short)).to be_truthy
      end

      it "パスワードに数字が含まれていない場合は無効" do
        user.password = "TestTest"
        user.valid?
        expect(user.errors.of_kind?(:password, :invalid)).to be_truthy
      end

      it "パスワードに半角大文字が含まれていない場合は無効" do
        user.password = "test1234"
        user.valid?
        expect(user.errors.of_kind?(:password, :invalid)).to be_truthy
      end

      it "パスワードに半角小文字が含まれていない場合は無効" do
        user.password = "TEST1234"
        user.valid?
        expect(user.errors.of_kind?(:password, :invalid)).to be_truthy
      end
    end
  end
end
