# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

user = User.create(first_name: 'John', last_name: 'Doe', email: 'john@doe.com', password: 'abcd1234', password_confirmation: 'abcd1234')

for i in 0..10
  stat = Stat.new({average_time: rand(0.9..2.5), accuracy: rand(50..80), user_id: 2})
  stat.created_at = i.days.ago
  stat.save
end
