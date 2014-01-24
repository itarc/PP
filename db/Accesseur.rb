require 'pg'
require 'uri'

require 'logger'

$log = Logger.new(STDOUT)
$log.level = Logger::INFO

class Accesseur
  
  dev_database_url = 'postgres://postgres:postgres@localhost:5432/smb111-lille'
  db = URI.parse(ENV["DATABASE_URL"] || dev_database_url)
  @@database = PG.connect(
    db.host, db.port, '', '', db.path[1..-1], db.user, db.password) 

  def initialize
    @@database.exec("set client_min_messages = warning")
  end
  
  def execute_sql(requete)
    begin
      return @@database.exec(requete)
    rescue Exception => exception
      $log.debug(requete)
      $log.debug(exception.message)
      fail
    end
  end
  
  def create_table(nom_de_table, colonnes)
    execute_sql("create table #{nom_de_table} (#{colonnes})")
  end
  
  def format_to_sql(chaine_de_caracteres)
    return '' if chaine_de_caracteres == nil
    return chaine_de_caracteres.gsub("'", "''")    
  end
  
end

class AccesseurTable
  attr_accessor :db
  @@db = Accesseur.new
end

if __FILE__ == $0 then
  
  require 'test/unit'
  
  class AccesseurDatabaseTest < Test::Unit::TestCase
  
    def test10_execute_requete
      db = Accesseur.new
      db.execute_sql("drop table if exists a")
      db.execute_sql("create table a (c1 TEXT)")
      db.execute_sql("insert into a values ('value')")
      result = db.execute_sql("select * from a")
      assert_equal [ { "c1" => "value" } ], result.to_a
      db.execute_sql("delete from a")    
      result = db.execute_sql("select * from a")
      assert_equal 0, result.num_tuples
      assert_raise IndexError do result[0] end
      db.execute_sql("drop table a")
    end
    
    def test20_erreur_requete
       db = Accesseur.new
       assert_raise PG::Error do db.execute_sql('x') end
     end
     
    def test30_create_table
      db = Accesseur.new
      db.execute_sql("drop table if exists a")
      db.create_table('a', 'c1 TEXT')
      assert_nothing_raised do db.execute_sql('select c1 from a') end
      db.execute_sql("drop table if exists a")
    end

    def test40_to_sql
      db = Accesseur.new
      assert_equal "doubler ''apostrophe''", db.format_to_sql("doubler 'apostrophe'")
      assert_equal "", db.format_to_sql(nil)     
    end
    
    def test50_insert_with_quote
      db = Accesseur.new
      db.execute_sql("drop table if exists a")
      db.create_table('a', 'c1 TEXT')
      assert_nothing_raised { db.execute_sql("insert into a values ('#{db.format_to_sql("'string with quotes'")}')") }
      assert_equal "'string with quotes'", db.execute_sql('select c1 from a')[0]['c1']
      db.execute_sql("drop table if exists a")
    end

  end
  
  class AccesseurTableTest < Test::Unit::TestCase
    
    class C1 < AccesseurTable; end
    class C2 < AccesseurTable; end
      
    def test10_multi_instance
      ressource_1 = AccesseurTable.new
      ressource_2 = AccesseurTable.new
      assert_equal ressource_1.db, ressource_2.db
      ressource_1 = C1.new
      ressource_2 = C2.new    
      assert_equal ressource_1.db, ressource_2.db
    end
      
  end

end
