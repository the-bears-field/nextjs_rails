require 'devise/jwt/test_helpers'

module AuthenticationHelper
  # 引数のUserモデルを用いて認証し、認可に必要なheadersを返す関数
  #
  # @params [User] Userモデル
  # @return [Hash] 認可に必要なヘッダーが格納されたハッシュ
  def sign_in(user)
    raise ArgumentError, "引数がUserモデルではありません。" if user.class.to_s != "User"

    params = {
      user: {
        email: user.email,
        password: user.password
      }
    }

    post '/v1/users/sign_in',
      headers: { origin: 'http://localhost' },
      params: params,
      as: :json

    token = response.headers['Authorization']

    # 認証ヘッダーを返す
    { 'Authorization' => token, 'Content-Type' => 'application/json', 'Accept' => 'application/json' }
  end
end
