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

  def test03_should_give_right_error_line_number
    post '/code_run_result', "print A"
    assert last_response.body.include?(":1:"), last_response.body
  end
  
  def test05_should_run_unit_tests
    post '/code_run_result', "require 'test/unit'"
    assert last_response.body.include?("0 tests, 0 assertions, 0 failures, 0 errors, 0 skips")  
  end
  
  def test06_should_run_utf8_code
    post '/code_run_result', "puts 'éèêàâùï'"
    assert last_response.body.include?('invalid multibyte char (US-ASCII)') 	  
    post '/code_run_result', "#encoding: utf-8\nputs 'éèêàâùï'"
    assert_equal "éèêàâùï\n", last_response.body
  end 
  
  def teardown
    $db.execute_sql("delete from run_events")	  
  end
  
end