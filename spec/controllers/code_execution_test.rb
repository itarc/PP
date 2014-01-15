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
    post '/code_execution_result', ""
    assert_equal "", last_response.body
  end
  
  def test02_should_execute_an_evaluation
    post '/code_execution_result', "1"
    assert_equal "1", last_response.body	  
  end
  
  def test03_should_evaluate_an_arythmetic_operation
    post '/code_execution_result', "2 + 2"
    assert_equal "4", last_response.body
  end  
  
  def test04_should_execute_an_instruction
    post '/code_execution_result', "print 3"
    assert_equal "3", last_response.body	  
  end
  
  def test05_should_raise_an_error
    post '/code_execution_result', "puts a"
    assert last_response.body.include?("undefined local variable or method `a'"), last_response.errors 
  end 

end