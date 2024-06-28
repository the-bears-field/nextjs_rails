class CreateComments < ActiveRecord::Migration[7.1]
  def change
    create_table :comments do |t|
      t.uuid :uuid, null: false, default: 'gen_random_uuid()'
      t.text :description, null: false

      t.timestamps

      t.index :uuid, unique: true
    end
  end
end
