require_relative "../../controllers/slideshow"

require 'test/unit'
require 'rack/test'

disable :sessions # Mandatory to test sessions, otherwise we cannot access session object

class TestCoding < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    $db.execute_sql("update compteur set identifiant = 0")
  end  
  
  def test01_should_not_execute_anything
    get '/code_execution_result', { }
    assert_equal "", last_response.body
  end
  
  def test02_should_execute_an_evaluation
    get '/code_execution_result', { :code => "1"}
    assert_equal "1", last_response.body	  
  end

  def test03_should_execute_another_evaluation
    get '/code_execution_result', { :code => "1 + 1"}
    assert_equal "2", last_response.body	  
  end
  
  def test04_should_execute_an_instruction
    get '/code_execution_result', { :code => "print 3"}
    assert_equal "3", last_response.body	  
  end
  
  def test05_should_execute_an_instruction
    get '/code_execution_result', { :code => "puts 'a'"}
    assert_equal "a\n", last_response.body	  
  end
  
  #~ def test05_should_raise_an_error
    #~ post '/code', { :code => "puts a"}
    #~ assert_equal "a\n", last_response.body, last_response.errors 
  #~ end  

end