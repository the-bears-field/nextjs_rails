class Post < ApplicationRecord
  has_many :user_post
  has_many :post_tag
  has_many :post_comment
end
