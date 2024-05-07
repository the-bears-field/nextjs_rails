class Post < ApplicationRecord
  has_many :user_posts, dependent: :destroy
  has_many :users, through: :user_posts
  has_many :post_tags, dependent: :destroy
  has_many :tags, through: :post_tags
  has_many :post_comments, dependent: :destroy
  has_many :comments, through: :post_comments
  validates :title, :description, presence: true
end
