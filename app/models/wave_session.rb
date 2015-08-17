class WaveSession < ActiveRecord::Base
  belongs_to :user
  belongs_to :waver, class_name: 'User'
end
