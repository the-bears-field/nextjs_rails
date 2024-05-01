class User < ApplicationRecord
  has_many :user_post
  has_many :post, through: :user_post
  has_many :user_comment
  has_many :comment, through: :user_comment
  validates :name, :email, :password_digest, presence: true
  validates :email, uniqueness: true
end
