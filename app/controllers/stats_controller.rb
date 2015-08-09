class StatsController < ApplicationController
  def index
    stats = current_user.stats.all
    @average_times = []
    @accuracy_rates = []

    stats.each { |stat| @average_times << stat.average_time; @accuracy_rates << stat.accuracy }
  end

  def new
    @stat = Stat.new
    # @tracker = current_user.trackers.find(params[:id])
    # gon.id = @tracker.core_id
    # gon.token = current_user.access_token
  end

  def create
    @stat = Stat.new(stat_params)

    respond_to do |format|
      format.html {
        if @stat.save
          redirect_to user_stat_path(current_user, @stat)
        else
          render :new
        end
      }
      format.js {}
    end
  end

  def show
    @stat = Stat.find(params[:id])
  end

  private
  def stat_params
    params.require(:stat).require(:average_time, :accuracy)
  end
end
