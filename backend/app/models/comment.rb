class Comment < ApplicationRecord
  has_many :post_comment
  has_many :post, through: :post_comment
  has_many :user_comment
  has_many :user, through: :user_comment
  validates :description, presence: true
end
