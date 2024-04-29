class Tag < ApplicationRecord
  has_many :post_tag
  validates :name, presence: true, uniqueness: true
end
