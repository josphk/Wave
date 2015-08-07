class User < ActiveRecord::Base
  has_many :trackers
  has_many :friendships
  has_many :friends, through: :friendships

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

  def added_friends
    self.friends.joins(:friendships).where('friendships.accepted = ?', true)
  end

  def pending_friends
    self.friends.joins(:friendships).where('friendships.accepted = ?', false)
  end
end
