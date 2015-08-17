class WaveSessionsController < ApplicationController
  before_action :firebase

  def create
    @session = current_user.wave_sessions.new(waver_id: params[:user_id])
    notification = @firebase.set("users/#{ params[:user_id] }/notifications/wave_sessions/#{ current_user.id }", { checked: false, published_at: Firebase::ServerValue::TIMESTAMP })
    response = @firebase.set("users/#{ current_user.id }/wave_sessions/#{ params[:user_id] }", { ready: false })
    gon.testerId = @session.user_id.to_s
    gon.waverId = params[:user_id]
    gon.waverName = User.find(params[:user_id]).first_name

    respond_to do |format|
      if response.success? && notification.success? && @session.save
        format.html { render 'show', layout: !request.xhr? }
      end
    end
  end

  def show
    @stat = Stat.new
    @session = WaveSession.find_by(waver_id: params[:user_id])
    gon.testerId = @session.user_id.to_s
    gon.waverId = params[:user_id]
    gon.waverName = User.find(params[:user_id]).first_name

    respond_to do |format|
      format.html { render layout: !request.xhr? }
    end
  end

  def destroy
    @session = current_user.wave_sessions.find_by(params[:waver_id])
    response = @firebase.delete("users/#{ @session.waver_id }/notifications/wave_sessions/#{ @session.user_id }")
    @session.destroy if response.success?

    respond_to do |format|
      format.js {}
    end
  end
end
