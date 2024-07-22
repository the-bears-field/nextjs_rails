class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :user_id, null: false
      t.string :name, null: false
      t.text :biography, null: false
      t.string :email, null: false
      t.string :normalized_email, null: false

      t.timestamps

      t.index :user_id, unique: true
      t.index :email, unique: true
      t.index :normalized_email, unique: true
    end
  end
end
