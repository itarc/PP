require 'pg'
require 'uri'

# CONNEXION
dev_database_url = 'postgres://postgres:postgres@localhost:5432/smb111-lille'
db = URI.parse(ENV["DATABASE_URL"] || dev_database_url)

connection = PG.connect( db.host, db.port, '', '', db.path[1..-1], db.user, db.password)

# LECTURE

puts '----- COMPTEUR'
read = connection.exec('select * from compteur')
p read.fields

read.values.each do |row|
  p row
end

puts '----- POLLS_SAVE'
read = connection.exec('select * from polls_save')
p read.fields

read.values.each do |row|
  p row
end

puts '----- POLLS'
read = connection.exec('select * from polls order by timestamp desc')
p read.fields

read.values.each do |row|
  p row
end

