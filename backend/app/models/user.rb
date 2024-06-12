class User < ApplicationRecord
  has_secure_password

  has_many :user_posts, dependent: :destroy
  has_many :posts, through: :user_posts
  has_many :user_comments, dependent: :destroy
  has_many :comments, through: :user_comments
  validates :name, :email, :normalized_email, :password_digest, presence: true
  validates :email, :normalized_email, uniqueness: true, format: URI::MailTo::EMAIL_REGEXP

  before_validation :set_normalized_email

  validate :verify_normalized_email, if: :normalized_email_changed?

  private

  # Userモデルのnormalized_email属性に
  # 正規化したメールアドレスを定義するセッター関数
  #
  # @return [nil]
  def set_normalized_email
    return unless email
    self.normalized_email = gmail_domain?(email) ? normalize_gmail(email) : email.downcase
  end

  # Gmailドメインが含まれているか判定
  #
  # @param email_address [String] メールアドレス
  # @return [Boolean] Gmailドメインが含まれているかの真偽値
  def gmail_domain?(email_address)
    email_address.end_with?('@gmail.com') || email_address.end_with?('@googlemail.com')
  end

  # Gmailアドレスのエイリアスとピリオドを削除したメールアドレスを返す関数
  #
  # @param [String] 正規化前のGmailアドレス
  # @return [String] 正規化後のGmailアドレス
  def normalize_gmail(email_address)
    local, domain = email_address.downcase.split('@')
    local = local.split('+').first.gsub('.', '')
    "#{local}@#{domain}"
  end

  # normalized_emailの値が登録済かを検証し、結果に応じてエラーを追加する関数
  #
  # @return [nil]
  def verify_normalized_email
    if gmail_domain?(email)
      local = normalized_email.split('@').first
      is_exist = User.where(normalized_email: "#{local}@gmail.com")
                  .or(User.where(normalized_email: "#{local}@googlemail.com"))
                  .exists?
    else
      is_exist = User.where(normalized_email: normalized_email).exists?
    end

    errors.add(:normalized_email, :taken) if is_exist
  end
end
