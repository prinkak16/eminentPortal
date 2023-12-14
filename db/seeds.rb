# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

file_status = [1, 2, 'A', 3, 'B', 'C', 4, 5, 'Dropped', 'Decline By Candidate', 'Passed Away']

file_status.each do |fs|
  FileStatusLevel.where(name: fs).first_or_create!
end
