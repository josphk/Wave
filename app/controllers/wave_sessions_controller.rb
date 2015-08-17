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
    @session = current_user.wave_sessions.find(params[:id])

    @stat = Stat.new



  end

  def destroy
    @session = current_user.wave_sessions.find_by(waver_id: params[:waver_id])
    @session.destroy

    respond_to do |format|
      format.js {}
    end
  end
end
