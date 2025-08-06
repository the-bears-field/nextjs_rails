#!/bin/bash
set -e

# Rails に対応したファイル server.pid が存在しているかもしれないので削除する。
rm -f /app/tmp/pids/server.pid

# コンテナ起動時に puma.sock を削除
rm -f /app/tmp/sockets/puma.sock

# コンテナーのプロセスを実行する。（Dockerfile 内の CMD に設定されているもの。）
exec "$@"
