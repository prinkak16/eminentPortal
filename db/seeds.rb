# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

file_status = [{name: 1,state:'In Progress'}, {name: 2,state: 'In Progress'}, {name: 'A', state: 'In Progress'},
               {name: 3, state: 'In Progress' }, {name: 'B', state: 'In Progress' }, 'C', 4, 5, 'Dropped', 'Decline By Candidate', 'Passed Away']

file_status.each do |fs|
  FileStatusLevel.where(name: fs).first_or_create!
end
