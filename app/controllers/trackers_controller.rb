class TrackersController < ApplicationController
  def authenticate
    params.except!(:utf8, :authenticity_token, :commit, :controller, :action)
    $access_token = HTTParty.post('https://api.particle.io/oauth/token', body: params)["access_token"]

    if $access_token != nil
      @token = $access_token
      @cores = HTTParty.get('https://api.particle.io/v1/devices', query: {access_token: $access_token})
    end

    respond_to do |format|
      format.html {
        if $access_token == nil
          redirect_to root_url, alert: "Username or password was incorrect. Please try again."
        else
          redirect_to root_url
        end
      }
      format.js {}
    end
  end

  def create
    @tracker = Tracker.new(tracker_params)
  end

  def destroy
    @tracker.destroy

    respond_to do |format|
      format.html { redirect_to root_url }
      format.js   {}
    end
  end
end
