require 'rails_helper'
require 'devise/jwt/test_helpers'

RSpec.describe "V1::Posts", type: :request do
  let(:user) { FactoryBot.create(:user, :with_posts) }

  describe "GET /v1/users/:user_id/posts エンドポイントのテスト" do
    before { get "/v1/users/#{user.user_id}/posts" }

    it '投稿データが空でないこと、投稿データの数が正しいことを確認' do
      expect(JSON.parse(response.body)).not_to be_empty
      expect(JSON.parse(response.body).size).to eq(3)
    end

    it 'ステータスコード200が返されることを確認' do
      expect(response).to have_http_status(200)
    end
  end

  describe "GET /v1/users/:user_id/posts/:uuid エンドポイントのテスト" do
    before { get "/v1/users/#{user.user_id}/posts/#{user.posts[0].uuid}" }

    it '投稿データが空でないこと、投稿データの数が正しいことを確認' do
      expect(JSON.parse(response.body)).not_to be_empty
      expect(JSON.parse(response.body)['id']).to eq(user.posts[0].id)
    end

    it 'ステータスコード200が返されることを確認' do
      expect(response).to have_http_status(200)
    end
  end

  describe "POST /v1/users/:user_id/posts エンドポイントのテスト" do
    it "ステータスコード201が返されることを確認" do
      auth_headers = sign_in(user)
      params = FactoryBot.attributes_for(:post)

      post "/v1/users/#{user.user_id}/posts", headers: auth_headers, params: params, as: :json

      expect(response).to have_http_status(201)
    end
  end

  describe "PUT /v1/users/:user_id/posts/:uuid エンドポイントのテスト" do
    it "ステータスコード204が返されることを確認" do
      auth_headers = sign_in(user)

      user.posts.count.times do |int|
        params = FactoryBot.attributes_for(:post)

        put "/v1/users/#{user.user_id}/posts/#{user.posts[int].uuid}",
            headers: auth_headers,
            params: params,
            as: :json

        expect(response).to have_http_status(204)
      end
    end
  end

  describe "DELETE /v1/users/:user_id/posts/:uuid エンドポイントのテスト" do
    it "ステータスコード204のレスポンスを返し、かつ記事の削除が成功していることを確認" do
      auth_headers = sign_in(user)
      int = rand(user.posts.count)
      target_uuid = user.posts[int].uuid

      # 削除前に記事が存在しているかを確認
      expect(Post.find_by(uuid: target_uuid)).to_not eq(nil)

      delete "/v1/users/#{user.user_id}/posts/#{target_uuid}",
          headers: auth_headers,
          as: :json

      # ステータスコード204のレスポンスを返すか確認
      expect(response).to have_http_status(204)
      # 記事の削除が成功しているか確認
      expect(Post.find_by(uuid: target_uuid)).to eq(nil)
    end
  end
end
