class CreateUserComments < ActiveRecord::Migration[7.1]
  def change
    create_table :user_comments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :comment, null: false, foreign_key: true

      t.timestamps
    end
  end
end
