class TrackersController < ApplicationController
  before_action :get_trackers, only: :index
  before_action :firebase, only: [:create, :destroy]

  def index
  end

  def authenticate
    params.except!(:utf8, :authenticity_token, :commit, :controller, :action)
    token = HTTParty.post('https://api.particle.io/oauth/token', body: params)["access_token"]

    if token != nil
      current_user.update_attributes(access_token: token)
      @trackers = HTTParty.get('https://api.particle.io/v1/devices', query: {access_token: token})
      redirect_to user_trackers_url(current_user)
    else
      flash.now[:alert] = "Username or password was incorrect. Please try again."
      render :index
    end
  end

  def create
    @tracker = current_user.trackers.build(tracker_params)
    response = @firebase.push('wave_trackers', { coreid: @tracker.core_id, status: 'online', published_at: Firebase::ServerValue::TIMESTAMP})

    respond_to do |format|
      if response.success? && @tracker.save
        format.html { redirect_to user_trackers_path(current_user) }
        format.js { get_trackers }
      else
        format.html { render user_trackers_path(current_user), alert: 'An error occured' }
        format.js { flash.now[:alert] = 'An error occured'}
      end
    end
  end

  def test
    @tracker = current_user.trackers.find(params[:id])
    gon.id = @tracker.core_id
    gon.token = current_user.access_token
  end

  def destroy
    @tracker = Tracker.find(params[:id])
    @tracker.destroy

    respond_to do |format|
      format.html { redirect_to root_url }
      format.js { get_trackers }
    end
  end

  private
  def tracker_params
    params.permit(:core_id, :name)
  end

  def get_trackers
    @trackers = if current_user.access_token
      HTTParty.get('https://api.particle.io/v1/devices', query: {access_token: current_user.access_token})
    end
  end
end
