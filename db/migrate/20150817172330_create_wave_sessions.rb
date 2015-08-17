class CreateWaveSessions < ActiveRecord::Migration
  def change
    create_table :wave_sessions do |t|
      t.integer :user_id
      t.integer :waver_id

      t.timestamps null: false
    end

    add_index :wave_sessions, :waver_id
  end
end
