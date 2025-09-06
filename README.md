# Rails API、Next.js を使用したブログアプリ

## 使用技術

- フロントエンド
  - Node.js v22.18.0
  - react@19.1.1
  - typescript@5.9.2
  - next@15.5.2
  - zod@4.1.5
  - tailwindcss@4.1.13
  - jest@29.4.1
- バックエンド
  - Ruby 3.4.5
  - Rails 8.0.2
  - RSpec 3.13
- データベース
  - PostgreSQL 17.5
- Web サーバー
  - nginx/1.28.0

## 必要要件

- Git
- Docker
- Docker Compose

## インストール

必要要件に記載している環境を整えた上で、ターミナルで下記コマンドを順番に実行してください。

```
git clone https://github.com/the-bears-field/nextjs_rails.git
```

```
cd nextjs_rails
```

```
sh initialization.sh
```

以上の過程を経てブラウザで[http://localhost](http://localhost)を開くと、ポートフォリオの閲覧が可能となります。

## データベース設計

```mermaid
erDiagram
    USERS {
        bigint id PK
        uuid uuid
        string user_id
        string name
        text biography
        string email
        string normalized_email
        string encrypted_password
        string reset_password_token
        datetime reset_password_sent_at
        datetime remember_created_at
        datetime created_at
        datetime updated_at
    }

    POSTS {
        bigint id PK
        uuid uuid
        string title
        text description
        datetime created_at
        datetime updated_at
    }

    TAGS {
        bigint id PK
        string name
        datetime created_at
        datetime updated_at
    }

    COMMENTS {
        bigint id PK
        uuid uuid
        text description
        datetime created_at
        datetime updated_at
    }

    USER_POSTS {
        bigint id PK
        bigint user_id FK
        bigint post_id FK
        datetime created_at
        datetime updated_at
    }

    POST_TAGS {
        bigint id PK
        bigint post_id FK
        bigint tag_id FK
        datetime created_at
        datetime updated_at
    }

    POST_COMMENTS {
        bigint id PK
        bigint post_id FK
        bigint comment_id FK
        datetime created_at
        datetime updated_at
    }

    USER_COMMENTS {
        bigint id PK
        bigint user_id FK
        bigint comment_id FK
        datetime created_at
        datetime updated_at
    }

    JWT_DENYLISTS {
        bigint id PK
        string jti
        datetime exp
        datetime created_at
        datetime updated_at
    }

    %% リレーションシップ
    USERS ||--o{ USER_POSTS                : "1対多(1以上)"
    POSTS ||--o{ USER_POSTS                : "1対多(1以上)"
    POSTS ||--o{ POST_TAGS                 : "1対多(1以上)"
    TAGS  ||--o{ POST_TAGS                 : "1対多(1以上)"
    POSTS ||--o{ POST_COMMENTS             : "1対多(1以上)"
    COMMENTS ||--o{ POST_COMMENTS          : "1対多(1以上)"
    USERS ||--o{ USER_COMMENTS             : "1対多(1以上)"
    COMMENTS ||--o{ USER_COMMENTS          : "1対多(1以上)"
```
