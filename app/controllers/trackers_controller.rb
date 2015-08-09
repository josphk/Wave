class TrackersController < ApplicationController
  def index
    @trackers = if current_user.access_token
      HTTParty.get('https://api.particle.io/v1/devices', query: {access_token: current_user.access_token})
    end
  end

  def authenticate
    params.except!(:utf8, :authenticity_token, :commit, :controller, :action)
    token = HTTParty.post('https://api.particle.io/oauth/token', body: params)["access_token"]

    if token != nil
      current_user.update_attributes(access_token: token)
      @trackers = HTTParty.get('https://api.particle.io/v1/devices', query: {access_token: token})
      redirect_to user_trackers_url(current_user)
    else
      flash.now[:particle_error] = "Username or password was incorrect. Please try again."
      render :index
    end
  end

  def create
    @tracker = current_user.trackers.build(core_id: params[:id])

    if @tracker.save
      redirect_to user_trackers_path(current_user)
    else
      flash.now[:alert] = "An error occured"
      render user_trackers_path(current_user)
    end
  end

  def canvas
    @tracker = Tracker.find(params[:id])
    gon.id = @tracker.core_id
    gon.token = current_user.access_token
  end

  def destroy
    @tracker.destroy

    respond_to do |format|
      format.html { redirect_to root_url }
      format.js   {}
    end
  end
end
