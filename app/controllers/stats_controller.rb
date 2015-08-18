class StatsController < ApplicationController
  # before_action :require_tracker_authenticated, only: :new
  def index
    @user = User.find(request.original_fullpath[/\d+/, 0])
    get_stats(@user)

    respond_to do |format|
      format.json { render json: { average_time: @average_times, accuracy: @accuracy_rates } }
    end
  end

  def new
    @stat = Stat.new

    respond_to do |format|
      format.html { render layout: !request.xhr? }
    end
  end

  def create
    @stat = current_user.stats.new(stat_params)

    respond_to do |format|
      if @stat.save
        format.html { redirect_to user_path(current_user) }
        format.js {
          user_id = request.referer[/\d+$/, 0]
          @user = User.find(params[:user_id])
          get_stats(@user)
        }
      else
        format.html { render :new }
        format.js {}
      end
    end
  end

  private
  def stat_params
    params.permit(:average_time, :accuracy, :user_id)
  end
end
