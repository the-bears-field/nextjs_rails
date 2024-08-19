class V1::PostsController < ApplicationController
  before_action :authenticate_user!, only: [:new, :create, :edit, :update, :destroy]
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
    @post = Post.new(post_params)

    if @post.save
      render json: { status: 'SUCCESS', data: @post }, status: :created
    else
      render json: { status: 'ERROR', data: @post.error }, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @post.update(post_params)
      render json: { status: 'SUCCESS', data: @post }, status: :no_content
    else
      render json: { status: 'ERROR', data: @post.error }, status: :conflict
    end
  end

  def destroy
    if @post.destroy
      render json: { status: 'SUCCESS', data: @post }, status: :no_content
    else
      render json: { status: 'ERROR', data: @post.error }, status: :bad_request
    end
  end

  private

  def set_user
    @user = User.find_by!(user_id: params[:user_user_id])
  end

  def set_post
    @post = @user.posts.find_by!(uuid: params[:uuid])
  end

  def post_params
    params.require(:post).permit(:title, :description)
  end
end
