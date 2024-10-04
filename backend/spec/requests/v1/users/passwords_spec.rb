require 'rails_helper'

RSpec.describe "V1::Users::Passwords", type: :request do
  let(:user) { FactoryBot.create(:user) }
  let(:origin) { 'http://localhost' }

  describe "POST /v1/users/password エンドポイントのテスト" do
    before do
      @params = { user: { email: user.email }}
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

  describe "PUT /v1/users/password エンドポイントのテスト" do
    before do
      @token = user.send_reset_password_instructions
      @params = {
        user: {
          reset_password_token: @token,
          password: 'newPassword1234',
          password_confirmation: 'newPassword1234'
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
      expect(user.reload.valid_password?('newPassword1234')).to be_truthy
    end
  end
end
