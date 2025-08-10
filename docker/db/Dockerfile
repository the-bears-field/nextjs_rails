FROM postgres:16.2

RUN apt-get update -qq && \
    apt-get install -y vim git && \
    rm -rf /var/lib/apt/lists/* && \
    echo "PS1='\${debian_chroot:+(\$debian_chroot)}\[\033[01;32m\]\u@\H\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\] $ '" >> /root/.bashrc

    # Vimの設定ファイルをコピー
COPY ./.vimrc /root/

# Vimの外部カラースキーム `molokai` を導入
RUN cd /root && \
    mkdir -p .vim/colors && \
    git clone https://github.com/tomasr/molokai && \
    mv molokai/colors/molokai.vim /root/.vim/colors/ && \
    rm -rf molokai
