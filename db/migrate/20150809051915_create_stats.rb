class CreateStats < ActiveRecord::Migration
  def change
    create_table :stats do |t|
      t.float :average_time
      t.float :accuracy
      t.integer :user_id

      t.timestamps null: false
    end

    add_index :stats, :user_id
  end
end
