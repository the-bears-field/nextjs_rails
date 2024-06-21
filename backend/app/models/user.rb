class User < ApplicationRecord
  has_secure_password

  # 半角英小文字大文字数字をそれぞれ1種類以上含む8文字以上100文字以下の正規表現
  PASSWORD_REGEXP = /\A(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,100}+\z/.freeze

  has_many :user_posts, dependent: :destroy
  has_many :posts, through: :user_posts
  has_many :user_comments, dependent: :destroy
  has_many :comments, through: :user_comments
  validates :name, :email, :normalized_email, :password_digest, presence: true
  validates :email, :normalized_email, uniqueness: true, format: URI::MailTo::EMAIL_REGEXP
  validates :password,
    length: { minimum: 8 },
    format: { with: PASSWORD_REGEXP },
    if: -> { new_record? || !password.blank? }

  before_validation :set_sanitized_name, :set_normalized_email

  validate :verify_normalized_email, if: :normalized_email_changed?

  private

  # トリミングとエスケープをした文字列を、
  # name属性に定義するセッター関数
  #
  # @return [nil]
  def set_sanitized_name
    self.name = sanitize_string_attribute(:name)
  end

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
  # @param email_address [String] 正規化前のGmailアドレス
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
