require 'pg'
require 'uri'

# CONNEXION
dev_database_url = 'postgres://postgres:postgres@localhost:5432/smb111-lille'
db = URI.parse(ENV["DATABASE_URL"] || dev_database_url)

connection = PG.connect( db.host, db.port, '', '', db.path[1..-1], db.user, db.password)

# LECTURE

puts '----- POWERPREZ'
read = connection.exec('select * from polls')
p read.fields

read.values.each do |row|
  p row
end

