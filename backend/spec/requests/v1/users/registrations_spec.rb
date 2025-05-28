require 'rails_helper'

RSpec.describe "V1::Users::Registrations", type: :request do
  let(:user) { FactoryBot.create(:user) }
  let(:reloaded_user) { user.reload }
  let(:auth_headers) { sign_in(user) }
  let(:headers_with_origin) { { origin: 'http://localhost' } }
  let(:auth_headers_with_origin) { auth_headers.merge(headers_with_origin) }
  let(:parsed_response) { JSON.parse(response.body) }

  describe "POST /v1/users エンドポイントのテスト" do
    before { @params = { user: FactoryBot.attributes_for(:user) } }

    context "ユーザー登録が成功する" do
      before do
        post "/v1/users/",
          headers: headers_with_origin,
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
        expect(parsed_response["user"]["user_id"]).to eq(@params[:user][:user_id])
        expect(parsed_response["user"]["name"]).to eq(@params[:user][:name])
        expect(parsed_response["user"]["email"]).to eq(@params[:user][:email])
        expect(parsed_response["message"]).to eq("ユーザー登録が成功しました。")
        expect(
          User.find_by(
            user_id: @params[:user][:user_id],
            name: @params[:user][:name],
            email: @params[:user][:email]
          ).present?
        ).to be_truthy
        expect(parsed_response["errors"]).to eq(nil)
      end
    end

    context "ユーザー登録が失敗する" do
      context "パラメータの値が不足していた場合" do
        before do
          post "/v1/users/",
          headers: headers_with_origin,
          as: :json
        end

        it "ステータスコード422が返されることを確認" do
          expect(response).to have_http_status(422)
        end

        it "ユーザー登録が失敗していることを確認" do
          expect(parsed_response["message"]).to eq("ユーザー登録に失敗しました。")
          expect(
            User.find_by(
              user_id: @params[:user][:user_id],
              name: @params[:user][:name],
              email: @params[:user][:email]
            ).present?
          ).to be_falsey
          expect(parsed_response["errors"]).to_not eq(nil)
        end
      end

      context "オリジンが異なっている場合" do
        before do
          post "/v1/users/",
          headers: { origin: 'http://www.example.com' },
          params: @params,
          as: :json
        end

        it "Access-Control-Allow-Credentials が`false`であることを確認" do
          expect(response.headers['Access-Control-Allow-Credentials']).to be_falsey
        end

        it "ユーザー登録が失敗していることを確認" do
          expect(parsed_response["user_id"]).to_not eq(@params[:user][:user_id])
          expect(parsed_response["name"]).to_not eq(@params[:user][:name])
          expect(parsed_response["email"]).to_not eq(@params[:user][:email])
          expect(
            User.find_by(
              user_id: @params[:user][:user_id],
              name: @params[:user][:name],
              email: @params[:user][:email]
            ).present?
          ).to be_falsey
          expect(parsed_response["errors"]).to_not eq(nil)
        end
      end
    end
  end

  describe "PUT /v1/users エンドポイントのテスト" do
    before do
      @params = { user: { user_id: 'test', name: 'test', biography: 'test' } }
    end

    context "ユーザー情報の更新が成功する" do
      before do
        put '/v1/users',
          headers: auth_headers_with_origin,
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
        expect(reloaded_user.user_id).to eq(@params[:user][:user_id])
        expect(reloaded_user.name).to eq(@params[:user][:name])
        expect(reloaded_user.biography).to eq(@params[:user][:biography])
      end
    end

    context "ユーザー情報の更新が失敗する" do
      context "パラメータの値が不足していた場合" do
        before do
          put '/v1/users',
            headers: auth_headers_with_origin,
            as: :json
        end

        it "ステータスコード204が返されることを確認" do
          expect(response).to have_http_status(204)
        end

        it "ユーザー情報が変更していないか確認" do
          expect(reloaded_user.user_id).to eq(user.user_id)
          expect(reloaded_user.name).to eq(user.name)
          expect(reloaded_user.biography).to eq(user.biography)
        end
      end

      context "オリジンが異なっている場合" do
        before do
          put '/v1/users',
            headers: auth_headers.merge({ origin: 'http://www.example.com' }),
            params: @params,
            as: :json
        end

        it "Access-Control-Allow-Credentials が`false`であることを確認" do
          expect(response.headers['Access-Control-Allow-Credentials']).to be_falsey
        end

        it "ユーザー情報の変更が失敗していることを確認" do
          expect(reloaded_user.user_id).to_not eq(@params[:user][:user_id])
          expect(reloaded_user.name).to_not eq(@params[:user][:name])
          expect(reloaded_user.biography).to_not eq(@params[:user][:biography])
          expect(parsed_response["errors"]).to_not eq(nil)
        end
      end

      context "認証されていない場合" do
        before do
          put '/v1/users',
            headers: headers_with_origin,
            params: @params,
            as: :json
        end

        it "ステータスコード401が返されることを確認" do
          expect(response).to have_http_status(401)
        end

        it "ユーザー情報が変更していないか確認" do
          expect(reloaded_user.user_id).to_not eq(@params[:user][:user_id])
          expect(reloaded_user.name).to_not eq(@params[:user][:name])
          expect(reloaded_user.biography).to_not eq(@params[:user][:biography])
        end
      end
    end
  end

  describe "DELETE /v1/users エンドポイントのテスト" do
    context "ユーザー情報の削除が成功する" do
      before do
        delete '/v1/users',
          headers: auth_headers_with_origin,
          as: :json
      end

      it "ステータスコード204が返されることを確認" do
        expect(response).to have_http_status(204)
      end

      it 'Access-Control-Allow-Credentials が`true`であることを確認' do
        expect(response.headers['Access-Control-Allow-Credentials']).to be_truthy
      end

      it "ユーザー削除が正常に完了していることを確認" do
        expect(
          User.find_by(
            user_id: user.user_id,
            name: user.name,
            email: user.email
          ).present?
        ).to be_falsey
      end
    end

    context "ユーザー情報の削除が失敗する" do
      context "オリジンが異なっている場合" do
        before do
          delete '/v1/users',
            headers: auth_headers.merge({ origin: 'http://www.example.com' }),
            as: :json
        end

        it "Access-Control-Allow-Credentials が`false`であることを確認" do
          expect(response.headers['Access-Control-Allow-Credentials']).to be_falsey
        end

        it "ユーザー削除が失敗していることを確認" do
          expect(
            User.find_by(
              user_id: user.user_id,
              name: user.name,
              email: user.email
            ).present?
          ).to be_truthy
        end
      end

      context "認証されていない場合" do
        before do
          delete '/v1/users',
            headers: headers_with_origin,
            as: :json
        end

        it "ステータスコード401が返されることを確認" do
          expect(response).to have_http_status(401)
        end

        it "ユーザー削除が失敗していることを確認" do
          expect(
            User.find_by(
              user_id: user.user_id,
              name: user.name,
              email: user.email
            ).present?
          ).to be_truthy
        end
      end
    end
  end
end
