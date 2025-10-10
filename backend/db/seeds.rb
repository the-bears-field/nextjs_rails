# トランザクションの開始
ActiveRecord::Base.transaction do
  begin
    # ユーザーデータを作成
    puts "ユーザーデータを作成しています..."

    users = []

    2.times do |i|
      user = User.create!(
        user_id: "user_#{i + 1}",
        name: Faker::Name.unique.name,
        biography: Faker::Lorem.paragraph(sentence_count: 2) || '',
        email: "user#{i + 1}@example.com",
        normalized_email: "user#{i + 1}@example.com",
        password: 'Password@1234'
      )
      user.valid?
      users << user
    end

    puts "#{users.count}名分のユーザーデータを作成しました。"

    # 各ユーザーに対して3つのポストを作成
    puts "各ユーザーの投稿を作成します..."

    posts = []

    users.each do |user|
      3.times do
        post = Post.create!(
          title: Faker::Lorem.sentence(word_count: 3),
          description: Faker::Lorem.paragraph(sentence_count: 10)
        )

        UserPost.create!(user: user, post: post)
        posts << post
      end

      puts "#{user.user_id}の投稿を#{posts.count}つ作成しました。"
    end

    # 20個のタグを作成
    puts "タグを作成します..."

    tags = []

    20.times do
      tag = Tag.create!(name: Faker::Lorem.unique.word)
      tags << tag
    end

    puts "#{tags.count}個のタグを作成しました。"

    # 各投稿にランダムにタグを紐づけ
    puts "投稿とタグの関連付けします..."

    posts.each do |post|
      post.tags << tags.sample(rand(1..5))
    end

    puts "投稿とタグの関連付けが完了しました。"

    # 5つのコメントを作成し、ランダムなユーザーとポストに関連付け
    puts "コメントを作成し、ユーザーと投稿との関連付けをします..."
    5.times do
      comment = Comment.create!(
        description: Faker::Lorem.sentence(word_count: 10)
      )
      UserComment.create!(user: users.sample, comment: comment)
      PostComment.create!(post: posts.sample, comment: comment)
    end

    puts "コメントの作成、ユーザーと投稿との関連付けが完了しました。"

    # シードデータの作成完了
    puts "初期データの作成が完了しました。"

  rescue => e
    # エラーメッセージの出力とトランザクションのロールバック
    puts "初期データ作成に失敗しました: #{e.message}"
    raise ActiveRecord::Rollback
  end
end
