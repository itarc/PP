require 'pg'
require 'uri'

# CONNEXION
dev_database_url = 'postgres://postgres:postgres@localhost:5432/smb111-lille'
db = URI.parse(ENV["DATABASE_URL"] || dev_database_url)

connection = PG.connect( db.host, db.port, '', '', db.path[1..-1], db.user, db.password)

# COPY TALE CONTENTS
puts '----- COPY POLLS INTO POLLS_SAVE'
connection.exec('insert into polls_save select * from polls')
puts '----- COPY POLLS INTO RUN_EVENTS_SAVE'
connection.exec('insert into run_events_save select * from run_events')

# DELETE TABLE CONTENTS
puts '----- EMPTY POLLS'
connection.exec('delete from polls')
puts '----- EMPTY RUN_EVENTS'
connection.exec('delete from run_events')
