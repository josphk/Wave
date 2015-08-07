class CreateFriendships < ActiveRecord::Migration
  def change
    create_table :friendships do |t|
      t.integer :user_id
      t.integer :friend_id
      t.boolean :accepted, default: false

      t.timestamps null: false
    end

    add_index :friendships, :friend_id
  end
end
