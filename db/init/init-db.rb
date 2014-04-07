require_relative '../Accesseur'
db = Accesseur.new

# COPY TALE CONTENTS
puts '----- COPY POLLS INTO POLLS_SAVE'
db.execute_sql('insert into polls_save select * from polls')
puts '----- COPY POLLS INTO RUN_EVENTS_SAVE'
db.execute_sql('insert into run_events_save select * from run_events')

# DELETE TABLE CONTENTS
puts '----- EMPTY POLLS'
db.execute_sql('delete from polls')
puts '----- EMPTY RUN_EVENTS'
db.execute_sql('delete from run_events')
