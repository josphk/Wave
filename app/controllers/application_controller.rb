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

  def require_tracker_authenticated
    if current_user.trackers.empty?
      redirect_to user_trackers_path(current_user), alert: "Register a motion tracker first"
    end
  end

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
    Tracker.exists?(core_id: id)
  end
  helper_method :registered?

  def get_friendships(user)
    if logged_in?
      @friendship = current_user.friendships.find_by_friend_id(user.id)
      @inverse_friendship = current_user.inverse_friendships.find_by_user_id(user.id)
    end
  end
end
