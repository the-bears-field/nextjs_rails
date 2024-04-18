class CreateComments < ActiveRecord::Migration[7.1]
  def change
    create_table :comments do |t|
      t.text :description, null: false

      t.timestamps
    end
  end
end