class User < ActiveRecord::Base
  has_many :trackers

  validates :password, confirmation: true, on: :create

  authenticates_with_sorcery!

  def is_not_particle_authenticated(params)
    HTTParty.post('https://api.particle.io/oauth/token', body: params)["error_description"] == "User credentials are invalid"
  end
end
