module FactoryBotHelpers
  # 関連するレコードを生成する関数
  #
  # @param main_factory [Object] メインモデルのファクトリ名を示すオブジェクト
  # @param associated_factory_symbol [Symbol] 関連するファクトリ名を示すシンボル
  # @param associated_factory_traits [Array<Symbol> | Array] 関連するファクトリのtrait名のシンボルを格納した配列
  # @param count [Integer] 処理回数
  # @return [nil]
  def create_associated_records(
    main_factory:,
    associated_factory_symbol:,
    associated_factory_traits: [],
    count: 1
  )
    # 各種シンボルを定義
    main_factory_symbol = main_factory.class.name.downcase.to_sym
    main_foreign_key = "#{main_factory_symbol}_id".to_sym
    associated_foreign_key = "#{associated_factory_symbol}_id".to_sym
    join_factory_symbol = generate_join_factory_symbol(main_factory_symbol, associated_factory_symbol)

    i = 0

    # ファクトリ生成のループ処理
    while i < count
      # 関連するファクトリを生成
      associated_factory = create(associated_factory_symbol, *associated_factory_traits)

      # 中間モデルのファクトリを生成
      create(
        join_factory_symbol,
        main_foreign_key => main_factory.id,
        associated_foreign_key => associated_factory.id
      )

      i += 1
    end
  end

  private

  # 引数の値から中間モデルのファクトリ名を示すシンボルを生成する関数
  #
  # @param main_factory_symbol [Symbol] メインモデルのファクトリ名を示すシンボル
  # @param associated_factory_symbol [Symbol] 関連するファクトリ名を示すシンボル
  # @return [Symbol] 中間モデルのファクトリ名を示すシンボル
  # -> :user_post, :post_tag, :post_comment or :user_comment
  def generate_join_factory_symbol(main_factory_symbol, associated_factory_symbol)
    [ main_factory_symbol.to_s, associated_factory_symbol.to_s ].join('_').to_sym
  end
end
