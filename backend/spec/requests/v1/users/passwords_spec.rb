require 'rails_helper'

RSpec.describe "V1::Users::Passwords", type: :request do
  let(:user) { FactoryBot.create(:user) }
  let(:origin) { 'http://localhost' }

  describe "POST /v1/users/password エンドポイントのテスト" do
    context "パスワード再設定のメールが送信される" do
      before do
        @params = { user: { email: user.email } }
        post "/v1/users/password",
          headers: { origin: origin },
          params: @params,
          as: :json
      end

      it "ステータスコード201が返されることを確認" do
        expect(response).to have_http_status(201)
      end

      it "パスワードリセットのメールが送信されていることを確認" do
        expect(ActionMailer::Base.deliveries.count).to eq(1)
      end
    end

    context "パスワード再設定のメールが送信されない" do
      context "パラメーターが不正である場合" do
        before do
          @params = { user: { email: user.email } }
          post "/v1/users/password",
            headers: { origin: origin },
            as: :json
        end

        it "ステータスコード422が返されることを確認" do
          expect(response).to have_http_status(422)
        end

        it "パスワードリセットのメールが送信されていないことを確認" do
          expect(ActionMailer::Base.deliveries.count).to eq(0)
        end
      end

      context "オリジンが異なっている場合" do
        before do
          @params = { user: { email: user.email } }
          post "/v1/users/password",
            headers: { origin: 'http://www.example.com' },
            params: @params,
            as: :json
        end

        it "ステータスコード422が返されることを確認" do
          expect(response).to have_http_status(403)
        end

        it "パスワードリセットのメールが送信されていないことを確認" do
          expect(ActionMailer::Base.deliveries.count).to eq(0)
        end
      end
    end
  end

  describe "PUT /v1/users/password エンドポイントのテスト" do
    context "パスワードのリセットが正常に完了した場合" do
      before do
        @token = user.send_reset_password_instructions
        @params = {
          user: {
            reset_password_token: @token,
            password: 'newPassword1234!',
            password_confirmation: 'newPassword1234!'
          }
        }

        put "/v1/users/password",
          headers: { origin: origin },
          params: @params,
          as: :json
      end

      it "ステータスコード204が返されることを確認" do
        expect(response).to have_http_status(204)
      end

      it "パスワードがリセットされ、ユーザーはログインできること" do
        expect(user.reload.valid_password?('newPassword1234!')).to be_truthy
      end
    end

    context "パスワードのリセットが失敗した場合" do
      context "パラメーターが不正である場合" do
        before do
          @token = user.send_reset_password_instructions

          put "/v1/users/password",
            headers: { origin: origin },
            as: :json
        end

        it "ステータスコード422が返されることを確認" do
          expect(response).to have_http_status(422)
        end

        it "パスワードがリセットされず、ユーザーはログインできないことを確認" do
          expect(user.reload.valid_password?('newPassword1234!')).to be_falsey
        end
      end

      context "オリジンが異なっている場合" do
        before do
          @token = user.send_reset_password_instructions
          @params = {
            user: {
              reset_password_token: @token,
              password: 'newPassword1234!',
              password_confirmation: 'newPassword1234!'
            }
          }

          put "/v1/users/password",
            headers: { origin: 'http://www.example.com' },
            params: @params,
            as: :json
        end

        it "ステータスコード403が返されることを確認" do
          expect(response).to have_http_status(403)
        end

        it "パスワードがリセットされず、ユーザーはログインできないことを確認" do
          expect(user.reload.valid_password?('newPassword1234!')).to be_falsey
        end
      end

      context "トークンが異なっている場合" do
        before do
          @params = {
            user: {
              reset_password_token: 'example',
              password: 'newPassword1234!',
              password_confirmation: 'newPassword1234!'
            }
          }

          put "/v1/users/password",
            headers: { origin: origin },
            params: @params,
            as: :json
        end

        it "ステータスコード422が返されることを確認" do
          expect(response).to have_http_status(422)
        end

        it "パスワードがリセットされず、ユーザーはログインできないことを確認" do
          expect(user.reload.valid_password?('newPassword1234!')).to be_falsey
        end
      end
    end
  end
end
