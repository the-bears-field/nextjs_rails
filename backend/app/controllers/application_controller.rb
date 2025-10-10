class ApplicationController < ActionController::API
  include ActionController::MimeResponds

  before_action :validate_origin, if: :devise_controller?

  respond_to :json

  protected

  # リクエストのオリジンヘッダーを検証
  # オリジンではない場合は、エラーを返す
  def validate_origin
    allowed_origins = ['http://localhost']
    unless allowed_origins.include?(request.headers['Origin'])
      render json: { success: false, errors: ['このオリジンは許可されていません'] }, status: :forbidden
    end
  end
end
