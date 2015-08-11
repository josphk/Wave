class FriendshipsController < ApplicationController
  before_action :get_user, except: :destroy
  skip_before_filter :get_current_url

  def create
    @friend_request = current_user.friendships.new(friend_id: params[:id])

    respond_to do |format|
      if @friend_request.save
        format.html { redirect_to session[:current_url], alert: "Friend request sent" }
        format.js { get_friendships(@user) }
      else
        format.html { render session[:current_url] }
        format.js { get_friendships(@user) }
      end
    end
  end

  def accept
    @friend_request = current_user.inverse_friendships.find_by_user_id(params[:id])
    @friend_request.update_attributes(accepted: true)

    respond_to do |format|
      format.html { redirect_to session[:current_url], alert: "You are now friends" }
      format.js { get_friendships(@user); get_stats(@user)}
    end
  end

  def destroy
    @user = User.find(params[:user_id])
    @friendship = Friendship.find(params[:id])
    @friendship.destroy

    respond_to do |format|
      format.html { redirect_to session[:current_url], alert: "Friend request cancelled" }
      format.js { get_friendships(@user) }
    end
  end

  private
  def get_user
    @user = User.find(params[:id])
  end
end
