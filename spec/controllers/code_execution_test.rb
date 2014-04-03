#encoding: utf-8

require_relative "../../controllers/slideshow"

require 'test/unit'
require 'rack/test'

class TestCodeRun < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    $db.execute_sql("delete from run_events")	  
  end
  
  def test01_should_not_run_anything_when_no_code
    post '/code_run_result/0', ""
    assert_equal "", last_response.body
  end
  
  def test02_should_run_code
    post '/code_run_result/0', "print 2"
    assert_equal "2", last_response.body
  end

  def test03_should_catch_exception
    post '/code_run_result/0', "print A"
    assert last_response.body.include?("uninitialized constant A")
  end
  
  def test04_should_run_unit_tests
    post '/code_run_result/0', "require 'test/unit'"
    assert last_response.body.include?("0 tests, 0 assertions, 0 failures, 0 errors, 0 skips")  
  end
  
  def test05_should_run_utf8_code
    post '/code_run_result/0', "puts 'éèêàâùï'"
    assert last_response.body.include?('invalid multibyte char (US-ASCII)') 	  
    post '/code_run_result/0', "#encoding: utf-8\nputs 'éèêàâùï'"
    assert_equal "éèêàâùï\n", last_response.body
  end  
  
  def teardown
    $db.execute_sql("delete from run_events")	  
  end
  
end


class TestLastExecution_in_attendee_slide < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    $db.execute_sql("delete from run_events")	  
  end
  
  def test01_should_be_empty_when_empty_database
    get '/code_last_execution/0'
    assert_equal "", last_response.body
  end

  def test02_should_return_last_send
    post '/code_send_result/0', "code sent", 'rack.session' => {:user_id => 'user_1'}
    get '/code_last_execution/0', {}, 'rack.session' => {:user_id => 'user_1'}
    assert_equal "code sent", last_response.body    
  end
  
  def test03_should_return_last_run 
    post '/code_run_result/0', "code run", 'rack.session' => {:user_id => 'user_1'}
    get '/code_last_execution/0', {}, 'rack.session' => {:user_id => 'user_1'}
    assert_equal "code run", last_response.body    
  end
  
  def teardown
    $db.execute_sql("delete from run_events")	  
  end
  
end

class TestLastExecution_in_teacher_slide < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    $db.execute_sql("delete from run_events")	  
  end

  def test01_should_return_last_attendee_send
    post '/code_send_result/0', "code sent", 'rack.session' => {:user_id => 'user_1'}
    get '/code_last_execution/0', {}, 'rack.session' => {:user_id => '0' }
    assert_equal "code sent", last_response.body    
  end
  
  def teardown
    $db.execute_sql("delete from run_events")	  
  end  
  
end