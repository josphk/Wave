class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :require_login, except: :index
  before_action :get_current_url

  private
  def not_authenticated
    redirect_to login_path, alert: "Please login first"
  end

  def require_logout
    if logged_in?
      redirect_to session[:current_url]
    end
  end

  # def require_tracker_authenticated
  #   if current_user.trackers.empty?
  #     render user_trackers_path(current_user), alert: "Register a Wave Motion first"
  #   end
  # end

  def get_current_url
    session[:current_url] = request.original_url
  end

  def particle_params(username, password)
    params = {
      client_id: "particle",
      client_secret: "particle",
      grant_type: "password",
      username: username,
      password: password
    }
  end

  def registered?(id)
    current_user.trackers.exists?(core_id: id)
  end
  helper_method :registered?

  def get_friendships(user)
    if logged_in?
      @friendship = current_user.friendships.find_by_friend_id(user.id)
      @inverse_friendship = current_user.inverse_friendships.find_by_user_id(user.id)
    end
  end

  def get_stats(user)
    @stats = user.stats.order(created_at: :desc)
    @average_times = []
    @accuracy_rates = []
    @stats.reverse.each do |stat|
      time_hash = {date: stat.created_at.to_i, value: stat.average_time}
      accr_hash = {date: stat.created_at.to_i, value: stat.accuracy}
      @average_times << time_hash
      @accuracy_rates << accr_hash
    end
  end

  def firebase()
    @firebase = Firebase::Client.new(ENV['firebase_url'])
  end
end
