class AddUniqueIndexToNameColumnOfTagsTable < ActiveRecord::Migration[7.1]
  def change
    change_table :tags do |t|
      t.index :name, unique: true
    end
  end
end
