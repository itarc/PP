require_relative "../../controllers/slideshow"

require 'test/unit'
require 'rack/test'

class TestCodeEvaluation < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def test01_should_not_evaluate_anything_when_no_code
    post '/code_evaluation_result', ""
    assert_equal "", last_response.body
  end
  
  def test02_should_evaluate_an_expression
    post '/code_evaluation_result', "1"
    assert_equal "1", last_response.body	  
  end
  
  def test03_should_evaluate_another_expression
    post '/code_evaluation_result', "2 + 2"
    assert_equal "4", last_response.body
  end  
  
  def test04_should_evaluate_an_instruction
    post '/code_evaluation_result', "print 3"
    assert_equal "3", last_response.body	  
  end
  
  def test05_should_raise_an_error
    post '/code_evaluation_result', "puts a"
    assert last_response.body.include?("undefined local variable or method `a'"), last_response.errors 
  end 

end

class TestCodeRun < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    $db.execute_sql("delete from run_events")	  
  end
  
  def test01_should_not_run_anything_when_no_code
    post '/code_run_result', ""
    assert_equal "", last_response.body
  end
  
  def test02_should_run_code
    post '/code_run_result', "print 2"
    assert_equal "2", last_response.body
  end

  def test03_should_catch_exception
    post '/code_run_result', "print A"
    assert last_response.body.include?("uninitialized constant A")
  end
  
  def test04_should_run_unit_tests
    post '/code_run_result', "require 'test/unit'"
    assert last_response.body.include?("0 tests, 0 assertions, 0 failures, 0 errors, 0 skips")  
  end
  
  def teardown
    $db.execute_sql("delete from run_events")	  
  end
  
end

class TestCodeGet < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    $db.execute_sql("delete from run_events")	  
  end
  
  def test01
    get '/code_last_run'
    assert_equal "", last_response.body
  end

  def test02
    post '/code_run_result', "print 3"
    get '/code_last_run'
    assert_equal "print 3", last_response.body
  end
  
  def teardown
    $db.execute_sql("delete from run_events")	  
  end
  
end