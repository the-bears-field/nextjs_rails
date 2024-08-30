class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist
  has_many :user_posts, dependent: :destroy
  has_many :posts, through: :user_posts
  has_many :user_comments, dependent: :destroy
  has_many :comments, through: :user_comments

  # 半角英小文字大文字数字をそれぞれ1種類以上含む8文字以上100文字以下の正規表現
  PASSWORD_REGEXP = /\A(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,100}+\z/.freeze

  # 半角英小文字大文字数字および半角アンダーバーいずれかを含む
  # 4文字以上15文字以下の正規表現
  USER_ID_REGEXP = /\A^[a-zA-Z0-9_]{4,15}$\z/.freeze

  validates :user_id,
    presence: true,
    length: { in: 4..15 },
    uniqueness: true,
    format: USER_ID_REGEXP
  validates :name, presence: true
  validates :email, :normalized_email,
    presence: true,
    uniqueness: true,
    format: URI::MailTo::EMAIL_REGEXP
  validates :password,
    presence: true,
    length: { minimum: 8 },
    format: { with: PASSWORD_REGEXP },
    if: -> { new_record? || !password.blank? }

  validate :verify_normalized_email, if: :normalized_email_changed?

  before_validation :set_sanitized_attributes, :set_normalized_email

  private

  # トリミングとエスケープをした文字列を
  # 各属性に定義するセッター関数
  #
  # @return [nil]
  def set_sanitized_attributes
    self.name = sanitize_string_attribute(:name)
    self.biography = biography.blank? ? "" : sanitize_string_attribute(:biography)
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
