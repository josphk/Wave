class FriendshipsController < ApplicationController
  skip_before_filter :get_current_url

  def create
    @friend_request = current_user.friendships.new(friend_id: params[:friend_id])

    respond_to do |format|
      format.html {
        if @friend_request.save
          redirect_to session[:current_url], alert: "Friend request sent"
        else
          render session[:current_url]
        end
      }

      format.js {}
    end
  end

  def accept
    @friend_request = current_user.inverse_friendships.find_by_user_id(params[:id])
    @friend_request.update_attributes(accepted: true)

    respond_to do |format|
      format.html { redirect_to session[:current_url], alert: "You are now friends" }
      format.js {}
    end
  end

  def destroy
    # @friendships = current_user.friendships.push(current_user.inverse_friendships)
    @friendship = Friendship.find(params[:id])
    @friendship.destroy

    respond_to do |format|
      format.html { redirect_to session[:current_url], alert: "Friend request cancelled" }
      format.js {}
    end
  end
end
