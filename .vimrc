" カラースキームと基本表示設定
set runtimepath+=~/molokai
syntax on
colorscheme molokai

" 行番号表示
set number

" カーソル行の背景色を変える
set cursorline

" カーソル位置のカラムの背景色を変える
set cursorcolumn

" ターミナルのタイトルをセット
set title

" タブ幅をスペース2にする
set tabstop=2

" tabを半角スペースで挿入
set expandtab

" 改行時に自動でインデント
set smartindent

" 空白文字の可視化
set list

" 可視化した空白文字の表示形式の定義
set listchars=tab:»-,trail:-,eol:↲,extends:»,precedes:«,nbsp:%

" "0"で始まる数値を、8進数として扱わないようにする
set nrformats-=octal

" ファイルの保存をしていなくても、べつのファイルを開けるようにする
set hidden

 " 文字のないところにカーソル移動できるようにする
set virtualedit=block

" カーソルの回り込みができるようになる
set whichwrap=b,s,[,],<,>

" バックスペースを、空白、行末、行頭でも使えるようにする
set backspace=indent,eol,start

" ステータス行を常に表示
set laststatus=2

" メッセージ表示欄を2行確保
set cmdheight=2

" 対応する括弧を強調表示
set showmatch

" ヘルプを画面いっぱいに開く
set helpheight=999

" インクリメンタル検索
set incsearch

" 大文字小文字を無視した検索
set ignorecase

" 大文字を含む場合は区別する
set smartcase

" システムクリップボードと連携
set clipboard=unnamedplus

" 全角スペース・行末のスペース・タブの可視化
if has("syntax")
    syntax on

    " PODバグ対策
    syn sync fromstart

    function! ActivateInvisibleIndicator()
        " 全角スペース
        syntax match InvisibleJISX0208Space "　" display containedin=ALL
        highlight InvisibleJISX0208Space term=underline ctermbg=Blue guibg=darkgray gui=underline

        " 行末スペース
        syntax match InvisibleTrailedSpace "[ \t]\+$" display containedin=ALL
        highlight InvisibleTrailedSpace term=underline ctermbg=Red guibg=NONE gui=undercurl guisp=darkorange

        " タブ文字
        syntax match InvisibleTab "\t" display containedin=ALL
        highlight InvisibleTab term=underline ctermbg=white gui=undercurl guisp=darkslategray
    endfunction

    augroup invisible
        autocmd! invisible
        autocmd BufNew,BufRead * call ActivateInvisibleIndicator()
    augroup END
endif
