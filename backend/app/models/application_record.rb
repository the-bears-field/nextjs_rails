class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  # Object.sendメソッド使用にあたり、モデルの属性名を格納したホワイトリスト
  VALID_ATTRIBUTES = [:biography, :name, :email, :title, :description].freeze

  private

  # モデルの文字列の属性に対し、トリミングとエスケープを行う処理
  #
  # @param attribute_name [Symbol] トリミングとエスケープを行う属性の名前
  # @return [String] トリミングとエスケープ後の属性値(文字列)
  def sanitize_string_attribute(attribute_name)
    unless VALID_ATTRIBUTES.include?(attribute_name)
      raise ArgumentError, "#{attribute_name} はホワイトリストに含まれていません。"
    end

    value = self.send(attribute_name)
    return if value.blank?
    CGI.escapeHTML(value.strip)
  end
end
