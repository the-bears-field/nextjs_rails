require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module App
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w(assets tasks))

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true

    # ロケールを日本語に変更
    config.i18n.default_locale = :ja

    # I18nライブラリに訳文の探索場所を指示
    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}').to_s]

    config.generators do |g|
      g.test_framework :rspec,
        view_specs: false,
        helper_specs: false,
        routing_specs: false
    end

    # クッキーおよびセッションストアに関わるミドルウェアを、
    # ミドルウェアスタックの末尾に追加する処理
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore

    # Deviseメーラーの規定のURLオプションを設定
    config.action_mailer.default_url_options = { host: 'api.localhost', port: 80 }

    # webコンテナからのアクセスを許可する設定
    config.hosts << 'web'

    # `example.com`および`www.example.com`や`image.example.com`などの
    # サブドメインを許可する設定
    config.hosts << 'example.com'
    config.hosts << /.*\.example\.com/
  end
end
