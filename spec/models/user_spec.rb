require 'rails_helper'

def particle_params(username, password)
  params = {
    client_id: "particle",
    client_secret: "particle",
    grant_type: "password",
    username: username,
    password: password
  }
end

RSpec.describe User, type: :model do
  it "returns true when user is not registered with Particle" do
    user = create(:user)
    params = particle_params(user.email, "password")
    expect(user.is_not_particle_authenticated(params)).to be true
  end
end
