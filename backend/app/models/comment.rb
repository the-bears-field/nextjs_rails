class Comment < ApplicationRecord
  has_many :post_comments, dependent: :destroy
  has_many :posts, through: :post_comments
  has_many :user_comments, dependent: :destroy
  has_many :users, through: :user_comments

  validates :description, presence: true

  before_validation :set_sanitized_description

  # トリミングとエスケープをした文字列を、description属性に定義するセッター関数
  #
  # @return [nil]
  def set_sanitized_description
    self.description = sanitize_string_attribute(:description)
  end
end
