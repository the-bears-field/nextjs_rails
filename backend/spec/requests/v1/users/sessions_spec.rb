require 'rails_helper'

RSpec.describe "V1::Users::Sessions", type: :request do
  let(:user) { FactoryBot.create(:user) }
  let(:auth_headers) { sign_in(user) }
  let(:origin) { 'http://localhost' }
  let(:params) {
    {
      user: {
        email: user.email,
        password: user.password
      }
    }
  }

  describe "POST /v1/users/sign_in エンドポイントのテスト" do
    before do
      post '/v1/users/sign_in',
        params: params,
        headers: { origin: origin },
        as: :json
    end

    it "ステータスコード201が返されることを確認" do
      expect(response).to have_http_status(201)
    end

    it 'Access-Control-Allow-Credentials が`true`であることを確認' do
      expect(response.headers['Access-Control-Allow-Credentials']).to be_truthy
    end

    it '認証ヘッダーを返すか確認' do
      expect(response.headers['Authorization']).to be_truthy
    end
  end

  describe "DELETE /v1/users/sign_out エンドポイントのテスト" do
    before do
      delete '/v1/users/sign_out',
        headers: auth_headers.merge({ origin: origin }),
        as: :json
    end

    it "ステータスコード204が返されることを確認" do
      expect(response).to have_http_status(204)
    end

    it 'Access-Control-Allow-Credentials が`true`であることを確認' do
      expect(response.headers['Access-Control-Allow-Credentials']).to be_truthy
    end

    it '認証ヘッダーを返さないことを確認' do
      expect(response.headers['Authorization']).to be_falsey
    end
  end
end
