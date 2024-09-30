require 'rails_helper'

RSpec.describe "V1::Users::Sessions", type: :request do
  let(:user) { FactoryBot.create(:user) }
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
end
