#!/bin/bash

# 環境変数ファイル作成
cp .env.example .env

# Dockerイメージ構築
docker compose build --no-cache

# バックエンドの動作に必要な環境変数を設定する処理
devise_jwt_secret_key=$(docker compose run --rm backend bin/rails secret)

if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOSの場合
  sed -i "" "s/DEVISE_JWT_SECRET_KEY=/DEVISE_JWT_SECRET_KEY=$devise_jwt_secret_key/g" .env
else
  # Linuxの場合
  sed -i "s/DEVISE_JWT_SECRET_KEY=/DEVISE_JWT_SECRET_KEY=$devise_jwt_secret_key/g" .env
fi

# データベースの初期設定
docker compose run --rm backend bin/rails db:setup

# フロントエンドのパッケージをインストール
docker compose run --rm frontend yarn install

# コンテナを構築、作成、起動
docker compose up -d
