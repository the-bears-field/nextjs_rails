class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts do |t|
      t.uuid :uuid, null: false, default: 'gen_random_uuid()'
      t.string :title, null: false
      t.text :description, null: false

      t.timestamps

      t.index :uuid, unique: true
    end
  end
end
