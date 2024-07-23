class V1::PostsController < ApplicationController
  before_action :set_user, only: [:index, :show, :create, :update, :destroy]
  before_action :set_post, only: [:show, :update, :destroy]

  def index
    @posts = @user.posts.order(created_at: :desc)

    render json: @posts
  end

  def show
    render json: @post
  end

  def new
  end

  def create
  end

  def edit
  end

  def update
  end

  def destroy
  end

  private

  def set_user
    @user = User.find_by!(user_id: params[:user_user_id])
  end

  def set_post
    @post = @user.posts.find_by!(uuid: params[:uuid])
  end
end
