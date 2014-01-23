# ############
nom_de_table = 'polls'; 
colonnes = '
  timestamp TEXT,
  user_id TEXT,
  question_id TEXT,
  response TEXT
'
# ############

require_relative '../Accesseur'
db = Accesseur.new

puts "'Drop' de la table <#{nom_de_table}> si elle existe"
db.execute_sql("drop table if exists #{nom_de_table}")

puts "Creation de la table <#{nom_de_table}>"
db.execute_sql("create table #{nom_de_table} (#{colonnes})")

# ############
nom_de_table = 'polls_save'; 
# ############

require_relative '../Accesseur'
db = Accesseur.new

puts "'Drop' de la table <#{nom_de_table}> si elle existe"
db.execute_sql("drop table if exists #{nom_de_table}")

puts "Creation de la table <#{nom_de_table}>"
db.execute_sql("create table #{nom_de_table} (#{colonnes})")

# ############
nom_de_table = 'compteur'; 
colonnes = '
  identifiant INTEGER
'
# ############

require_relative '../Accesseur'
db = Accesseur.new

puts "'Drop' de la table <#{nom_de_table}> si elle existe"
db.execute_sql("drop table if exists #{nom_de_table}")

puts "Creation de la table <#{nom_de_table}>"
db.execute_sql("create table #{nom_de_table} (#{colonnes})")

puts "Initailisation du compteur de table <#{nom_de_table}> avec 0"
db.execute_sql("insert into #{nom_de_table} values (0)")

# ############
nom_de_table = 'teacher_current_slide'; 
colonnes = '
  current_slide_id TEXT
'
# ############

require_relative '../Accesseur'
db = Accesseur.new

puts "'Drop' de la table <#{nom_de_table}> si elle existe"
db.execute_sql("drop table if exists #{nom_de_table}")

puts "Creation de la table <#{nom_de_table}>"
db.execute_sql("create table #{nom_de_table} (#{colonnes})")

puts "Initailisation du compteur de table <#{nom_de_table}> avec 1"
db.execute_sql("insert into #{nom_de_table} values (1)")

# ############
nom_de_table = 'run_events'; 
colonnes = '
  timestamp TEXT,
  user_id TEXT,
  code_input TEXT,
  code_output TEXT
'
# ############

require_relative '../Accesseur'
db = Accesseur.new

puts "'Drop' de la table <#{nom_de_table}> si elle existe"
db.execute_sql("drop table if exists #{nom_de_table}")

puts "Creation de la table <#{nom_de_table}>"
db.execute_sql("create table #{nom_de_table} (#{colonnes})")

puts "Initailisation du compteur de table <#{nom_de_table}> avec 1"
db.execute_sql("insert into #{nom_de_table} values (1)")
