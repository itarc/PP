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
  
  def test02_should_be_0_when_table_is_empty
    get '/teacher_current_slide'    
    assert_equal "0", last_response.body
  end  
  
  def test03_should_be_value_when_created
    post '/teacher_current_slide', {:index => '1'}
    get '/teacher_current_slide'    
    assert_equal "1", last_response.body
  end   

  def test04_should_be_value_when_updated
    post '/teacher_current_slide', {:index => '1'} # create
    post '/teacher_current_slide', {:index => '2'} # update
    get '/teacher_current_slide'    
    assert_equal "2", last_response.body
  end 

  def teardown	  
    $db.execute_sql("delete from teacher_current_slide")	  
  end   

end