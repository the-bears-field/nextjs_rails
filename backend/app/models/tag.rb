class Tag < ApplicationRecord
  has_many :post_tag
  has_many :post, through: :post_tag
  validates :name, presence: true, uniqueness: true
end
