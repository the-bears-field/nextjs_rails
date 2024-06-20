class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  # Object.sendメソッド使用にあたり、モデルの属性名を格納したホワイトリスト
  VALID_ATTRIBUTES = [:name, :email, :title, :description].freeze

  private

  # モデルの文字列の属性に対し、トリミングとエスケープを行う処理
  #
  # @param attribute_name [Symbol] トリミングとエスケープを行う属性の名前
  # @return [String] トリミングとエスケープ後の属性値(文字列)
  def sanitize_string_attribute(attribute_name)
    return unless VALID_ATTRIBUTES.include?(attribute_name)
    value = self.send(attribute_name)
    return if value.blank?
    escape_string(value.strip)
  end

  # 引数の文字列をエスケープする処理
  #
  # @param string [String] エスケープ前の文字列
  # @return [String] エスケープ後の文字列
  def escape_string(string)
    CGI.escapeHTML(string) if string.present?
  end
end
