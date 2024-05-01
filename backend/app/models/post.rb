class Post < ApplicationRecord
  has_many :user_post
  has_many :user, through: :user_post
  has_many :post_tag
  has_many :tag, through: :post_tag
  has_many :post_comment
  has_many :comment, through: :post_comment
  validates :title, :description, presence: true
end
