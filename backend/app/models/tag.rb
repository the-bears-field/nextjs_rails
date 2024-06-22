class Tag < ApplicationRecord
  has_many :post_tags, dependent: :destroy
  has_many :posts, through: :post_tags

  validates :name, presence: true, uniqueness: true

  before_validation :set_sanitized_name

  private

  # トリミングとエスケープをした文字列を、name属性に定義するセッター関数
  #
  # @return [nil]
  def set_sanitized_name
    self.name = sanitize_string_attribute(:name)
  end
end
