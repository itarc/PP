require_relative "../../controllers/slideshow"

require 'test/unit'
require 'rack/test'

class TestsWithOneAttendee < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    $db.execute_sql("delete from polls")  
  end
  
  def test01_AttendeeDoesNotAnswer

    get '/poll_response_1_rate_to_question_1'
    assert last_response.ok?, last_response.errors    
    assert_equal "0", last_response.body
    
  end  

  def test02_AttendeeGivesOnlyOneAnswer
	  
    post '/poll_response_1_to_question_1'
    assert last_response.ok?, last_response.errors

    get '/poll_response_1_rate_to_question_1'
    assert last_response.ok?, last_response.errors    
    assert_equal "100", last_response.body
    
  end
  
  def test03_AttendeeGivesTwoDifferentesAnswers
	  
    post '/poll_response_1_to_question_1'
    assert last_response.ok?, last_response.errors

    post '/poll_response_2_to_question_1'
    assert last_response.ok?, last_response.errors

    get '/poll_response_1_rate_to_question_1'
    assert last_response.ok?, last_response.errors  

    assert_equal "0", last_response.body
    
    get '/poll_response_2_rate_to_question_1'
    assert last_response.ok?, last_response.errors  

    assert_equal "100", last_response.body    
    
  end  
  
  def test03_AttendeeGivesTwoAnswerToTwoDifferenteResponses
	  
    post '/poll_response_1_to_question_1'
    assert last_response.ok?, last_response.errors

    post '/poll_response_2_to_question_2'
    assert last_response.ok?, last_response.errors

    get '/poll_response_1_rate_to_question_1'
    assert last_response.ok?, last_response.errors  

    assert_equal "100", last_response.body
    
    get '/poll_response_2_rate_to_question_2'
    assert last_response.ok?, last_response.errors  

    assert_equal "100", last_response.body    
    
  end   
  
  def teardown
    $db.execute_sql("delete from polls")    
  end
  
end
