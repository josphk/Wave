class FriendshipsController < ApplicationController
  before_action :get_user, except: :destroy
  before_action :firebase
  skip_before_filter :get_current_url

  def create
    @friend_request = current_user.friendships.new(friend_id: params[:id])
    response = @firebase.set("users/#{ params[:id] }/notifications/friend_requests/#{ current_user.id }", { accepted: false, checked: false, published_at: Firebase::ServerValue::TIMESTAMP })

    respond_to do |format|
      if response.success? && @friend_request.save
        format.html { redirect_to session[:current_url], alert: "Friend request sent" }
        format.js { get_friendships(@user) }
      else
        format.html { render session[:current_url] }
        format.js { get_friendships(@user) }
      end
    end
  end

  def update_friends
    respond_to do |format|
      format.js {}
    end
  end

  def accept
    @friend_request = current_user.inverse_friendships.find_by_user_id(params[:id])
    @friend_request.update_attributes(accepted: true)
    response = @firebase.update("users/#{ current_user.id }/notifications/friend_requests/#{ params[:id] }", { accepted: true })

    respond_to do |format|
      if response.success?
        format.html { redirect_to session[:current_url], alert: "You are now friends" }
        format.js { get_friendships(@user); get_stats(@user)}
      end
    end
  end

  def destroy
    @user = User.find(params[:user_id])
    @friendship = Friendship.find(params[:id])
    response = @firebase.delete("users/#{ @friendship.friend_id }/notifications/friend_requests/#{ @friendship.user_id }")
    @friendship.destroy if response.success?

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
