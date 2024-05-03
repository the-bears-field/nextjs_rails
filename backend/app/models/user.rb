class User < ApplicationRecord
  has_many :user_posts
  has_many :posts, through: :user_posts
  has_many :user_comments
  has_many :comments, through: :user_comments
  validates :name, :email, :password_digest, presence: true
  validates :email, uniqueness: true
end
