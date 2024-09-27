require 'rails_helper'

RSpec.describe "V1::Users::Registrations", type: :request do
  let(:user) { FactoryBot.create(:user) }
  let(:auth_headers) { sign_in(user) }
  let(:origin) { 'http://localhost' }

  describe "POST /v1/users エンドポイントのテスト" do
    before do
      @params = { user: FactoryBot.attributes_for(:user) }
      post "/v1/users/",
        headers: { origin: origin },
        params: @params,
        as: :json
    end

    it "ステータスコード201が返されることを確認" do
      expect(response).to have_http_status(201)
    end

    it 'Access-Control-Allow-Credentials が`true`であることを確認' do
      expect(response.headers['Access-Control-Allow-Credentials']).to be_truthy
    end

    it "ユーザー登録が正常に完了していることを確認" do
      expect(
        User.find_by(
          user_id: @params[:user][:user_id],
          name: @params[:user][:name],
          email: @params[:user][:email]
        ).present?
      ).to be_truthy
    end
  end

  describe "PUT /v1/users エンドポイントのテスト" do
    before do
      @params = { user: { user_id: 'test', name: 'test', biography: 'test' } }
      put '/v1/users',
        headers: auth_headers.merge({ origin: origin }),
        params: @params,
        as: :json
    end

    it "ステータスコード204が返されることを確認" do
      expect(response).to have_http_status(204)
    end

    it 'Access-Control-Allow-Credentials が`true`であることを確認' do
      expect(response.headers['Access-Control-Allow-Credentials']).to be_truthy
    end

    it "ユーザー情報の変更が成功しているかを確認" do
      changed_user = User.find_by(uuid: user.uuid)

      expect(changed_user.user_id).to_not eq(user.user_id)
      expect(changed_user.name).to_not eq(user.name)
      expect(changed_user.biography).to_not eq(user.biography)
    end
  end
end
