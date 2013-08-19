require 'test/unit'
require 'rack/test'

require_relative './slideshow.rb'

class SlideShow < Test::Unit::TestCase
	
  include Rack::Test::Methods

  def app
	  
    Sinatra::Application

  end

  def test01_should_save_teacher_current_slide

    post '/teacher_current_slide', :index => "2"
    get   '/teacher_current_slide'
     
   assert_equal '2', last_response.body

  end

  def test02_should_resume_poll

    post '/resume_poll' 

    get '/poll_rate_1' 
    assert_equal '0', last_response.body

    get '/poll_rate_2' 
    assert_equal '0', last_response.body

  end


  def test03_should_compute_poll_with_one_question_and_one_response

    get '/poll_rate_1' 
    assert_equal '0', last_response.body

    post '/poll_radio_1' 

    get '/poll_rate_1' 
    assert_equal '100', last_response.body

  end
  
  def test04_should_compute_poll_with_one_question_and_two_responses

    post '/resume_poll'

    post '/poll_radio_1' 
    
    get '/poll_rate_1' 
    assert_equal '100', last_response.body    

    get '/poll_rate_2' 
    assert_equal '0', last_response.body

    post '/poll_radio_2' 
    
    get '/poll_rate_1' 
    assert_equal '0', last_response.body      

    get '/poll_rate_2' 
    assert_equal '100', last_response.body    

  end  
  


end
