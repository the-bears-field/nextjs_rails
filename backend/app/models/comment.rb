class Comment < ApplicationRecord
  has_many :post_comments
  has_many :posts, through: :post_comments
  has_many :user_comments
  has_many :users, through: :user_comments
  validates :description, presence: true
end
