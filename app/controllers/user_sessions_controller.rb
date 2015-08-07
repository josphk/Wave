class UserSessionsController < ApplicationController
  before_action :require_logout, except: :destroy
  skip_before_filter :get_current_url
  skip_before_filter :require_login, except: :destroy

  def new
    @user = User.new
  end

  def create
    if @user = login(params[:email], params[:password])
      unless @user.access_token.nil?
        h = particle_params(params[:email], params[:password])
        token = HTTParty.post('https://api.particle.io/oauth/token', body: h)["access_token"]
        @user.update_attributes(access_token: token)
      end
      redirect_back_or_to(root_url, notice: "Login successful")
    else
      flash.now[:alert] = "Login failed"
      render :new
    end
  end

  def destroy
    logout
    redirect_to(root_url, notice: "Logged out")
  end
end
