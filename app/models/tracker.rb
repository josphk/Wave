class Tracker < ActiveRecord::Base
  belongs_to :user

  before_save :default_name

  def default_name
    self.name = 'My Wave Motion' if self.name.blank?
  end
end
