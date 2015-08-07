class UsersController < ApplicationController
  before_action :require_logout
  skip_before_filter :get_current_url
  skip_before_filter :require_login

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)

    if @user.save
      auto_login(@user)
      redirect_to root_url
    else
      render :new
    end
  end

  def create_with_particle
    @user = User.new(user_params)
    h = particle_params(user_params[:email], user_params[:password])

    unless @user.is_not_particle_authenticated(h)
      if @user.save
        auto_login(@user)

        @user.access_token = HTTParty.post('https://api.particle.io/oauth/token', body: params)["access_token"]
        redirect_to root_url
      else
        render :new
      end
    else
      flash[:alert] = "Email or password was incorrect"
      render :new
    end
  end

  private
  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation)
  end
end
