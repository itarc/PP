require_relative "../../controllers/slideshow"

require 'test/unit'
require 'rack/test'

disable :sessions # Mandatory to test sessions, otherwise we cannot access session object

class TestSlideShowHelper_next_user_id < Test::Unit::TestCase

  def test01 
    $db.execute_sql("update compteur set identifiant = 0")
    assert_equal 1, next_user_id
  end

end

class TestSession < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    $db.execute_sql("update compteur set identifiant = 0")
  end  
  
  def test01_should_create_one_user_id

    session = {}
    
    get '/', {}, 'rack.session' => session
    assert_equal 1, session[:user_id]
    
  end
  
  def test01_should_not_create_another_user_id_when_one_exists

    session = {}
    
    get '/', {}, 'rack.session' => session
    assert_equal 1, session[:user_id]
    
    get '/', {}, 'rack.session' => session
    assert_equal 1, session[:user_id]    
    
  end  
  
  def test02_should_create_two_user_id

    session = {}
    
    get '/', {}, 'rack.session' => session
    assert_equal 1, session[:user_id]
    
    session = {}    
    
    get '/', {}, 'rack.session' => session
    assert_equal 2, session[:user_id]    
    
  end  
  
  def teardown
    $db.execute_sql("update compteur set identifiant = 0")	  
  end  
  
end
