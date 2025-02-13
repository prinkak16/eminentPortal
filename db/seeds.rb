# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

file_status = [
               {name: 'Pending',state:'Pending'},
               {name: 1,state:'In Progress'},
               {name: 2,state: 'In Progress'},
               {name: 'A', state: 'In Progress'},
               {name: 3, state: 'In Progress' },
               {name: 'B', state: 'In Progress' },
               {name: 'C', state: 'In Progress' },
               {name: 4, state: 'In Progress'},
               {name: 5, state: 'Verified'},
               {name: 'Dropped', state: 'Rejected' },
               {name: 'Decline By Candidate', state: 'Rejected' },
               {name: 'Passed Away', state: 'Rejected'}]

file_status.each do |fs|
  fsv = FileStatusLevel.where(name: fs[:name]).first_or_create!
  fsv.state = fs[:state]
  fsv.save
end
