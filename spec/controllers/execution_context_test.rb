#encoding: utf-8

require_relative "../../controllers/slideshow"

require 'test/unit'
require 'rack/test'
require 'json'

class TestExecutionContext < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    $db.execute_sql("delete from run_events")	  
  end
  
  def test01_should_be_empty_when_empty_database
    get '/code_last_execution/0'
    assert_equal JSON.parse('{}'), JSON.parse(last_response.body)
  end

  def test03_should_return_last_execution_context_send
    post '/code_save_execution_context/0', '{ "type": "send", "code" : "code sent", "code_output": "code result"}', 'rack.session' => {:user_session_id => '1_user_name'}
    get '/code_last_execution/0', {}, 'rack.session' => {:user_session_id => '1_user_name'} 
    assert_equal JSON.parse('{ "type": "send", "author": "user_name", "code": "code sent", "code_output": "code result" }'), JSON.parse(last_response.body) 
  end
  
  def test04_should_return_last_execution_context_send_run
    post '/code_save_execution_context/0', '{ "type": "send", "code" : "code run", "code_output": "code result"}', 'rack.session' => {:user_session_id => '1_user_name'}
    get '/code_last_execution/0', {}, 'rack.session' => {:user_session_id => '1_user_name'}   
    assert_equal JSON.parse('{ "type": "send", "author": "user_name", "code": "code run", "code_output": "code result"}'), JSON.parse(last_response.body)     
  end
  
  def test05_should_save_and_return_code_with_double_quote
    post '/code_save_execution_context/0', '{ "type": "run", "code" : "puts \"1\"" }', 'rack.session' => {:user_session_id => '1_user_name'}
    get '/code_last_execution/0', {}, 'rack.session' => {:user_session_id => '1_user_name'}     
    assert_equal JSON.parse(last_response.body)["code"], 'puts "1"'        
  end  
  
  def test06_should_return_empty_if_not_the_right_slide
    post '/code_save_execution_text/0', '{ "code": "code run" }', 'rack.session' => {:user_session_id => '1_user_name'}
    get '/code_last_execution/1', {}, 'rack.session' => {:user_session_id => '1_user_name'}
    assert_equal JSON.parse('{}'), JSON.parse(last_response.body)
  end
  
  def teardown
    $db.execute_sql("delete from run_events")	  
  end
  
end

class TestLastExecution < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    $db.execute_sql("delete from run_events")	  
  end

  def test01_should_return_last_attendee_send
    post '/code_save_execution_context/0', '{ "type": "send", "code" : "code sent", "code_output": "code result"}', 'rack.session' => {:user_session_id => '1_attendee_name'}    
    get '/code_attendees_last_send/0', {}, 'rack.session' => {:user_session_id => $teacher_session_id }
    assert_equal JSON.parse('{ "type": "send", "author": "attendee_name", "code": "code sent", "code_output": "code result"}'), JSON.parse(last_response.body)         
  end
  
  def test02_should_return_last_attendee_send_even_if_a_run_is_fresher
    post '/code_save_execution_context/0', '{ "type": "send", "code" : "code sent", "code_output": "code result"}', 'rack.session' => {:user_session_id => '1_attendee_name'}    
    post '/code_save_execution_context/0', '{ "type": "run", "code" : "code run", "code_output": "code result"}', 'rack.session' => {:user_session_id => '1_attendee_name'}    
    get '/code_attendees_last_send/0', {}, 'rack.session' => {:user_session_id => $teacher_session_id }    
    assert_equal JSON.parse('{ "type": "send", "author": "attendee_name", "code": "code sent", "code_output": "code result"}'), JSON.parse(last_response.body)             
  end  
  
  def test03_should_return_last_attendee_send_even_if_teacher_made_a_run
    post '/code_save_execution_context/0', '{ "type": "send", "code" : "code sent", "code_output": "code result"}', 'rack.session' => {:user_session_id => '1_attendee_name'}    
    post '/code_save_execution_context/0', '{ "type": "run", "code" : "code run", "code_output": "code result"}', 'rack.session' => {:user_session_id => $teacher_session_id}        
    get '/code_attendees_last_send/0', {}, 'rack.session' => {:user_session_id => $teacher_session_id }   
    assert_equal JSON.parse('{ "type": "send", "author": "attendee_name", "code": "code sent", "code_output": "code result"}'), JSON.parse(last_response.body)             
  end    
  
  def test04_should_return_last_attendee_send_empty_after_last_teacher_send
    post '/code_save_execution_context/0', '{ "type": "send", "code" : "code sent", "code_output": "code result"}', 'rack.session' => {:user_session_id => '1_attendee_name'}    
    post '/code_save_execution_context/0', '{ "type": "send", "code" : "code sent", "code_output": "code result"}', 'rack.session' => {:user_session_id => $teacher_session_id}            
    get '/code_attendees_last_send/0', {}, 'rack.session' => {:user_session_id => $teacher_session_id }
    assert_equal JSON.parse('{}'), JSON.parse(last_response.body)   
  end 

  def test05_should_return_last_attendee_empty_after_last_teacher_send
    post '/code_save_execution_context/0', '{ "type": "send", "code" : "code sent", "code_output": "code result"}', 'rack.session' => {:user_session_id => '1_attendee_name'}    
    post '/code_save_execution_context/0', '{ "type": "send", "code" : "code sent", "code_output": "code result"}', 'rack.session' => {:user_session_id => $teacher_session_id}                
    post '/code_save_execution_context/0', '{ "type": "send", "code" : "code sent", "code_output": "code result"}', 'rack.session' => {:user_session_id => '2_attendee_name_2'}                
    get '/code_attendees_last_send/0', {}, 'rack.session' => {:user_session_id => $teacher_session_id }    
    assert_equal JSON.parse('{ "type": "send", "author": "attendee_name_2", "code": "code sent", "code_output": "code result"}'), JSON.parse(last_response.body)                 
  end
  
  def teardown
    $db.execute_sql("delete from run_events")	  
  end  
  
end

class TestLastSendToBlackBoard < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    $db.execute_sql("delete from run_events")	  
  end

  def test01_should_get_last_send_to_blackboard
    post '/code_save_execution_context/0', '{ "type": "run", "code" : "teacher run", "code_output": "code result"}', 'rack.session' => {:user_session_id => $teacher_session_id }        
    get '/code_get_last_send_to_blackboard/0', {}, 'rack.session' => {:user_session_id => '1_attendee_name' }
    assert_equal JSON.parse('{ "type": "run", "author": "'+ $teacher_session_id.split('_')[1] +'", "code": "teacher run", "code_output": "code result"}'), JSON.parse(last_response.body)                     
  end

  def test02_should_get_last_teacher_typing
    post '/code_save_execution_context/0', '{ "type": "refresh", "code" : "teacher typing", "code_output": ""}', 'rack.session' => {:user_session_id => $teacher_session_id }        
    get '/code_get_last_send_to_blackboard/0', {}, 'rack.session' => {:user_session_id => '1_attendee_name' }
    assert_equal JSON.parse('{ "type": "refresh", "author": "'+ $teacher_session_id.split('_')[1] +'", "code": "teacher typing", "code_output": ""}'), JSON.parse(last_response.body)                     
  end  
  
  def teardown
    $db.execute_sql("delete from run_events")	  
  end  
  
end