class PostComment < ApplicationRecord
  belongs_to :post
  belongs_to :comment

  validates :post_id, :comment_id, presence: true
end
