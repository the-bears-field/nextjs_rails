class User < ApplicationRecord
  has_many :user_post
  has_many :user_comment
end
