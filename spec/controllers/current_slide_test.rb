require_relative "../../controllers/slideshow"

require 'test/unit'
require 'rack/test'

class TestTeacherCurrentSlide < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup	  
    $db.execute_sql("delete from teacher_current_slide")
  end
  
  def test01_should_be_0_if_unknown
    get '/teacher_current_slide'
    assert_equal "0", last_response.body
  end
  
  def test02_should_be_inserted_if_unknown
    post '/teacher_current_slide'
    get '/teacher_current_slide'    
    assert_equal "0", last_response.body
  end  
  
  def test03_should_be_updated_when_created
    post '/teacher_current_slide'
    post '/teacher_current_slide', {:index => '1'}
    get '/teacher_current_slide'    
    assert_equal "1", last_response.body
  end   

  def teardown	  
    $db.execute_sql("delete from teacher_current_slide")	  
  end   

end