require 'rails_helper'

RSpec.describe "V1::Users::Registrations", type: :request do
  describe "POST /v1/users エンドポイントのテスト" do
    before do
      @params = { user: FactoryBot.attributes_for(:user) }
      post "/v1/users/", params: @params, as: :json
    end

    it "ステータスコード201が返されることを確認" do
      expect(response).to have_http_status(201)
    end

    it "ユーザー登録が正常に完了していることを確認" do
      expect(
        User.where(
          user_id: @params[:user][:user_id]
        ).where(
          name: @params[:user][:name]
        ).where(
          email: @params[:user][:email]
        ).present?
      ).to be_truthy
    end
  end
end
