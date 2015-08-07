class CreateTrackers < ActiveRecord::Migration
  def change
    create_table :trackers do |t|
      t.string :core_id
      t.integer :user_id

      t.timestamps null: false
    end
  end
end
