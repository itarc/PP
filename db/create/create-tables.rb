require_relative '../Accesseur'
db = Accesseur.new

# ############
table_name = 'polls'; 
columns = '
  timestamp TEXT,
  user_id TEXT,
  question_id TEXT,
  response TEXT
'
# ############

puts "'Drop' de la table <#{table_name}> si elle existe"
db.execute_sql("drop table if exists #{table_name}")

puts "Creation de la table <#{table_name}>"
db.execute_sql("create table #{table_name} (#{columns})")

# ############
table_name = 'polls_save'; 
# ############

puts "'Drop' de la table <#{table_name}> si elle existe"
db.execute_sql("drop table if exists #{table_name}")

puts "Creation de la table <#{table_name}>"
db.execute_sql("create table #{table_name} (#{columns})")

# ############
table_name = 'sessions'; 
columns = '
  last_session_id INTEGER
'
# ############

puts "'Drop' de la table <#{'compteur'}> si elle existe" ### Table renamed
db.execute_sql("drop table if exists #{'compteur'}")

puts "'Drop' de la table <#{table_name}> si elle existe"
db.execute_sql("drop table if exists #{table_name}")

puts "Creation de la table <#{table_name}>"
db.execute_sql("create table #{table_name} (#{columns})")

puts "Initialisation du compteur de table <#{table_name}> avec 0"
db.execute_sql("insert into #{table_name} values (0)")

# ############
table_name = 'teacher_current_slide'; 
columns = '
  current_slide_id TEXT
'
# ############

puts "'Drop' de la table <#{table_name}> si elle existe"
db.execute_sql("drop table if exists #{table_name}")

puts "Creation de la table <#{table_name}>"
db.execute_sql("create table #{table_name} (#{columns})")

puts "Initialisation numero de slide courant <#{table_name}> avec 0"
db.execute_sql("insert into #{table_name} values (0)")

# ############
table_name = 'run_events'; 
columns = '
  timestamp TEXT,
  user_id TEXT,
  type TEXT,
  slide_index TEXT,
  code_input TEXT,
  code_output TEXT
'
# ############

puts "'Drop' de la table <#{table_name}> si elle existe"
db.execute_sql("drop table if exists #{table_name}")

puts "Creation de la table <#{table_name}>"
db.execute_sql("create table #{table_name} (#{columns})")

# ############
table_name = 'run_events_save'; 
# ############

puts "'Drop' de la table <#{table_name}> si elle existe"
db.execute_sql("drop table if exists #{table_name}")

puts "Creation de la table <#{table_name}>"
db.execute_sql("create table #{table_name} (#{columns})")

# ############
table_name = 'flip_values'; 
columns = '
symbol TEXT,
value TEXT
'
# ############

puts "'Drop' de la table <#{table_name}> si elle existe"
db.execute_sql("drop table if exists #{table_name}")

puts "Creation de la table <#{table_name}>"
db.execute_sql("create table #{table_name} (#{columns})")
