require 'rails_helper'
require 'devise/jwt/test_helpers'

RSpec.describe "V1::Posts", type: :request do
  let(:user) { FactoryBot.create(:user, :with_posts) }
  let(:auth_headers) { sign_in(user) }
  let(:origin) { 'http://localhost' }

  describe "GET /v1/users/:user_id/posts エンドポイントのテスト" do
    before do
      get "/v1/users/#{user.user_id}/posts",
        headers: { origin: origin }
    end

    it '投稿データが空でないこと、投稿データの数が正しいことを確認' do
      expect(JSON.parse(response.body)).not_to be_empty
      expect(JSON.parse(response.body).size).to eq(3)
    end

    it 'ステータスコード200が返されることを確認' do
      expect(response).to have_http_status(200)
    end

    context 'レスポンスヘッダーの確認' do
      it 'Access-Control-Allow-Origin が、設定したオリジンの値と同一であることを確認' do
        expect(response.headers['Access-Control-Allow-Origin']).to eq(origin)
      end

      it 'Access-Control-Allow-Credentials が、`true`であることを確認' do
        expect(response.headers['Access-Control-Allow-Credentials']).to be_truthy
      end
    end
  end

  describe "GET /v1/users/:user_id/posts/:uuid エンドポイントのテスト" do
    before do
      get "/v1/users/#{user.user_id}/posts/#{user.posts[0].uuid}",
        headers: { origin: origin }
    end

    it '投稿データが空でないこと、投稿データの数が正しいことを確認' do
      expect(JSON.parse(response.body)).not_to be_empty
      expect(JSON.parse(response.body)['post']['uuid']).to eq(user.posts[0].uuid)
    end

    it 'ステータスコード200が返されることを確認' do
      expect(response).to have_http_status(200)
    end

    context 'レスポンスヘッダーの確認' do
      it 'Access-Control-Allow-Origin: 設定したオリジンの値と同一であることを確認' do
        expect(response.headers['Access-Control-Allow-Origin']).to eq(origin)
      end

      it 'Access-Control-Allow-Credentials が`true`であることを確認' do
        expect(response.headers['Access-Control-Allow-Credentials']).to be_truthy
      end
    end
  end

  describe "POST /v1/users/:user_id/posts エンドポイントのテスト" do
    before do
      @params = FactoryBot.attributes_for(:post)
    end

    it "投稿前の記事が存在しないことを確認" do
      expect(
        Post.where(
          title: @params[:title]
        ).where(
          description: @params[:description]
        ).blank?
      ).to be_truthy
    end

    it "ステータスコード201が返されることを確認" do
      post "/v1/users/#{user.user_id}/posts",
        headers: auth_headers,
        params: @params,
        as: :json

      expect(response).to have_http_status(201)
    end

    it "投稿が正常にされていることを確認" do
      post "/v1/users/#{user.user_id}/posts",
        headers: auth_headers,
        params: @params,
        as: :json

      expect(
        Post.where(
          title: @params[:title]
        ).where(
          description: @params[:description]
        ).present?
      ).to be_truthy
    end
  end

  describe "PUT /v1/users/:user_id/posts/:uuid エンドポイントのテスト" do
    before do
      @params = FactoryBot.attributes_for(:post)
      @random_int = rand(user.posts.count)
    end

    it "変更前の記事が同一であることを確認" do
      target_uuid = user.posts[@random_int].uuid
      post = Post.find_by(uuid: target_uuid)

      expect(post.title).to eq(user.posts[@random_int].title)
      expect(post.description).to eq(user.posts[@random_int].description)
    end

    it "ステータスコード204が返されることを確認" do
      put "/v1/users/#{user.user_id}/posts/#{user.posts[@random_int].uuid}",
          headers: auth_headers,
          params: @params,
          as: :json

      expect(response).to have_http_status(204)
    end

    it "記事の変更が成功しているか確認" do
      put "/v1/users/#{user.user_id}/posts/#{user.posts[@random_int].uuid}",
          headers: auth_headers,
          params: @params,
          as: :json

      target_uuid = user.posts[@random_int].uuid
      post = Post.find_by(uuid: target_uuid)

      expect(post.title).to_not eq(user.posts[@random_int].title)
      expect(post.description).to_not eq(user.posts[@random_int].description)
    end
  end

  describe "DELETE /v1/users/:user_id/posts/:uuid エンドポイントのテスト" do
    before { @target_post = user.posts.sample }

    it "記事の削除が成功していることを確認" do
      expect {
        delete "/v1/users/#{user.user_id}/posts/#{@target_post.uuid}",
          headers: auth_headers,
          as: :json
      }.to change { Post.count }.by(-1)
    end

    it "ステータスコード204が返されることを確認" do
      delete "/v1/users/#{user.user_id}/posts/#{@target_post.uuid}",
        headers: auth_headers,
        as: :json

      expect(response).to have_http_status(204)
    end
  end
end
