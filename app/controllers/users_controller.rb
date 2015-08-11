class UsersController < ApplicationController
  before_action :require_logout, except: :show
  skip_before_filter :get_current_url, except: :show
  skip_before_filter :require_login

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    @user.validate_password!

    if !@user.errors.any? && @user.save
      auto_login(@user)
      redirect_to root_url
    else
      @user.save
      @user.validate_password!
      render :new
    end
  end

  def create_with_particle
    @user = User.new(user_params)
    h = particle_params(user_params[:email], user_params[:password])

    unless @user.is_not_particle_authenticated(h)
      @user.access_token = HTTParty.post('https://api.particle.io/oauth/token', body: h)["access_token"]

      if @user.save
        auto_login(@user)
        redirect_to root_url
      else
        render :new
      end
    else
      @user.errors[:base] << "Email or password was incorrect"
      render :new
    end
  end

  def show
    @user = User.find(params[:id])
    get_friendships(@user)
    get_stats(@user)
  end

  private
  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation)
  end
end
