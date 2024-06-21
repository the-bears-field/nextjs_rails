class Post < ApplicationRecord
  has_many :user_posts, dependent: :destroy
  has_many :users, through: :user_posts
  has_many :post_tags, dependent: :destroy
  has_many :tags, through: :post_tags
  has_many :post_comments, dependent: :destroy
  has_many :comments, through: :post_comments
  validates :title, :description, presence: true

  before_validation :set_sanitized_attributes

  # トリミングとエスケープをした文字列を、各属性に定義するセッター関数
  #
  # @return [nil]
  def set_sanitized_attributes
    self.title = sanitize_string_attribute(:title)
    self.description = sanitize_string_attribute(:description)
  end
end
