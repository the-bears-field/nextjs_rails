# frozen_string_literal: true

class V1::Users::RegistrationsController < Devise::RegistrationsController
  before_action :validate_origin, only: [:create, :update, :destroy]

  # GET /resource/sign_up
  # def new
  #   super
  # end

  # POST /resource
  def create
    # If you have extra params to permit, append them to the sanitizer.
    devise_parameter_sanitizer.permit(:sign_up, keys: [:user_id, :name, :biography])

    build_resource(sign_up_params)

    if resource.save
      render json: {
        message: 'ユーザー登録が成功しました。',
        user: resource,
        success: true
      }, status: :created
    else
      render json: {
        message: 'ユーザー登録に失敗しました。',
        errors: resource.errors.full_messages,
        success: false
      }, status: :unprocessable_entity
    end
  end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  def update
    # If you have extra params to permit, append them to the sanitizer.
    devise_parameter_sanitizer.permit(:account_update, keys: [:user_id, :name, :biography])

    super
  end

  # DELETE /resource
  def destroy
    super
  end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  protected

  # デフォルトの処理を上書きし、パスワードを不要化
  def update_resource(resource, params)
    resource.update_without_password(params)
  end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end
end
