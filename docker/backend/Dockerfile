FROM ruby:3.3.1

ENV ROOT="/app"
ENV LANG=C.UTF-8
ENV TZ=Asia/Tokyo

WORKDIR ${ROOT}

COPY ./backend/Gemfile ./backend/Gemfile.lock ${ROOT}

RUN apt-get update -qq && \
    apt-get install -y nodejs vim postgresql-client && \
    gem install bundler && \
    bundle install && \
    echo "PS1='\${debian_chroot:+(\$debian_chroot)}\[\033[01;32m\]\u@\H\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\] $ '" >> /root/.bashrc

# コンテナー起動時に毎回実行されるスクリプトを追加
COPY ./docker/backend/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# イメージ実行時に起動させる主プロセスを設定
CMD ["rails", "server", "-e"]
