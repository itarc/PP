require_relative "../../controllers/slideshow"

require 'test/unit'
require 'rack/test'

class TestsSession < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    $db.execute_sql("update compteur set identifiant = 0")	  
    $db.execute_sql("delete from polls")
  end
  
  def test01

    get '/admin'
    
    assert_equal "LAST_USER_ID</br>0</br>POLLS</br>", last_response.body

  end
  
  def test02
	  
    $db.execute_sql("update compteur set identifiant = 1")	  
    $db.execute_sql("insert into polls values ('0', '0', '0', '0')")	  

    get '/admin'
    
    assert_equal "LAST_USER_ID</br>1</br>POLLS</br>0, 0, 0, 0, </br>", last_response.body

  end

  def test03

    $db.execute_sql("update compteur set identifiant = 1")
    $db.execute_sql("insert into polls values ('0', '0', '0', '0')")
    $db.execute_sql("insert into polls values ('1', '1', '1', '1')")	  

    get '/admin'
    
    assert_equal "LAST_USER_ID</br>1</br>POLLS</br>1, 1, 1, 1, </br>0, 0, 0, 0, </br>", last_response.body

  end
  
  def teardown
    $db.execute_sql("update compteur set identifiant = 0")	  
    $db.execute_sql("delete from polls")	  
  end  
  
end  