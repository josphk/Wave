class Tracker < ActiveRecord::Base
  belongs_to :user

  before_save :default_name

  def default_name
    self.name = 'My Wave Tracker' if self.name.blank?
  end
end
