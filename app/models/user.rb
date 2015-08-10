class User < ActiveRecord::Base
  has_many :trackers
  has_many :stats
  has_many :friendships
  has_many :friends, through: :friendships
  has_many :inverse_friendships, class_name: "Friendship", foreign_key: :friend_id
  has_many :inverse_friends, through: :inverse_friendships, source: :user

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true, uniqueness: true

  validates :password, confirmation: true, on: :create
  validates :password_confirmation, presence: true, on: :create

  authenticates_with_sorcery!

  mount_uploader :avatar, AvatarUploader

  def is_not_particle_authenticated(params)
    HTTParty.post('https://api.particle.io/oauth/token', body: params)["error_description"] == "User credentials are invalid"
  end

  def validate_password!
    errors.add(:password, "must include at least 8 characters and one number and letter") if password !~ /(?=.*[a-zA-Z])(?=.*[0-9]).{8,}/
  end

  def accepted_friends
    accepted_friends = []
    self.friendships.where('friendships.accepted = ?', true).each do |f|
      accepted_friends << User.find(f.friend_id)
    end
    return accepted_friends
  end

  def accepted_inverse_friends
    accepted_friends = []
    self.inverse_friendships.where('friendships.accepted = ?', true).each do |f|
      accepted_friends << User.find(f.user_id)
    end
    return accepted_friends
  end

  def pending_friends
    pending_friends = []
    self.friendships.where('friendships.accepted = ?', false).each do |f|
      pending_friends << User.find(f.friend_id)
    end
    return pending_friends
  end

  def pending_inverse_friends
    pending_friends = []
    self.inverse_friendships.where('friendships.accepted = ?', false).each do |f|
      pending_friends << User.find(f.user_id)
    end
    return pending_friends
  end
end