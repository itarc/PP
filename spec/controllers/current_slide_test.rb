require_relative "../../controllers/slideshow"

require 'test/unit'
require 'rack/test'

class TestsSession < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup	  
    $db.execute_sql("update teacher_current_slide set current_slide_id = '0'")
  end
  
  def test01

    get '/teacher_current_slide'
    
    assert_equal "0", last_response.body

  end
  
  def test02

    post '/teacher_current_slide', {:index => '1'}
    
    get '/teacher_current_slide'    
    
    assert_equal "1", last_response.body

  end  
  
  def test03

    post '/teacher_current_slide', {:index => '2'}
    
    get '/teacher_current_slide'    
    
    assert_equal "2", last_response.body

  end   

  def teardown	  
    #~ $db.execute_sql("delete from polls")	  
  end   

end