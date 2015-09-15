class SorceryCore < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :first_name,       null: false
      t.string :last_name,        null: false
      t.string :email,            null: false
      t.boolean :demo,            default: false
      t.string :access_token
      t.string :crypted_password
      t.string :salt
      t.string :avatar,           default: nil
      t.string :cover,            default: nil

      t.timestamps
    end

    add_index :users, :email, unique: true
  end
end