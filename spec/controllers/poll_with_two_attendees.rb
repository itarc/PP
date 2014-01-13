require_relative "../../controllers/slideshow"

require 'test/unit'
require 'rack/test'

class TestsTwoAttendees < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    $db.execute_sql("delete from polls")    
  end
  
  def test_should_be_50_50
	  
    post '/poll_response_1_to_question_1', {}, 'rack.session' => { :user_id => 'user_1' }
    assert last_response.ok?, last_response.errors

    post '/poll_response_2_to_question_1', {}, 'rack.session' => { :user_id => 'user_2' }
    assert last_response.ok?, last_response.errors

    get '/poll_response_1_rate_to_question_1'
    assert last_response.ok?, last_response.errors  

    assert_equal "50", last_response.body
    
    get '/poll_response_2_rate_to_question_1'
    assert last_response.ok?, last_response.errors  

    assert_equal "50", last_response.body    
    
  end  
  
  def test_should_be_67_33
	  
    post '/poll_response_1_to_question_1', {}, 'rack.session' => { :user_id => 'user_1' }
    assert last_response.ok?, last_response.errors

    post '/poll_response_2_to_question_1', {}, 'rack.session' => { :user_id => 'user_2' }
    assert last_response.ok?, last_response.errors

    post '/poll_response_1_to_question_1', {}, 'rack.session' => { :user_id => 'user_3' }
    assert last_response.ok?, last_response.errors

    get '/poll_response_1_rate_to_question_1'
    assert last_response.ok?, last_response.errors  

    assert_equal "67", last_response.body
    
    get '/poll_response_2_rate_to_question_1'
    assert last_response.ok?, last_response.errors  

    assert_equal "33", last_response.body    
    
  end   
  
  def teardown
    $db.execute_sql("delete from polls")    
  end
  
end
