class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.uuid :uuid, null: false, default: 'gen_random_uuid()'
      t.string :user_id, null: false
      t.string :name, null: false
      t.text :biography, null: false
      t.string :email, null: false, default: ""
      t.string :normalized_email, null: false, default: ""

      t.timestamps

      t.index :uuid, unique: true
      t.index :user_id, unique: true
      t.index :email, unique: true
      t.index :normalized_email, unique: true
    end
  end
end
