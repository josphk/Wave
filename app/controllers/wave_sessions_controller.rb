class WaveSessionsController < ApplicationController
  def create
    @session = current_user.wave_sessions.new(waver_id: params[:user_id])

    respond_to do |format|
      if @session.save
        format.html { render 'show', layout: !request.xhr? }
      end
    end
  end

  def show
    @user = current_user.accepted_friends.find(params[:id])
    @stat = Stat.new
    gon.userId = @user.id

    respond_to do |format|
      format.html { render layout: !request.xhr? }
    end
  end
end
