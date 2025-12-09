# frozen_string_literal: true

class V1::Users::SessionsController < Devise::SessionsController
  before_action :validate_origin, only: [:create, :destroy]
  before_action :configure_sign_in_params, only: [:create]

  respond_to :json

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  #
  # @return [JSON] サインイン結果のJSONレスポンス
  #   成功時: { value: { user_id: String }, success: true }
  #   失敗時: { errors: [String], success: false }
  def create
    resource = warden.authenticate(auth_options)

    if resource
      sign_in(resource_name, resource)

      render json: {
        value: resource.as_json(only: [:user_id]),
        success: true
      }, status: :created
    else
      render json: {
        errors: [I18n.t('devise.failure.invalid', default: 'Invalid email or password.')],
        success: false
      }, status: :unauthorized
    end
  end

  # DELETE /resource/sign_out
  def destroy
    super
  end

  protected

  # If you have extra params to permit, append them to the sanitizer.
  def configure_sign_in_params
    devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
  end
end
