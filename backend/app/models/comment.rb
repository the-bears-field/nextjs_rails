class Comment < ApplicationRecord
  has_many :post_comment
  has_many :user_comment
end
