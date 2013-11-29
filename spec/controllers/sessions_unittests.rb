require_relative "../../controllers/slideshow"

require 'test/unit'
require 'rack/test'

disable :sessions # Mandatory to test sessions, otherwise we cannot access session

class TestsSession < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    $session_id = 0
  end  
  
  def test01_should_create_one_session_id

    session = {}
    
    get '/', {}, 'rack.session' => session
    assert_equal 1, session[:session_id]
    
  end
  
  def test01_should_not_create_another_session_id_when_one_exists

    session = {}
    
    get '/', {}, 'rack.session' => session
    assert_equal 1, session[:session_id]
    
    get '/', {}, 'rack.session' => session
    assert_equal 1, session[:session_id]    
    
  end  
  
  def test02_should_create_two_session_id

    session = {}
    
    get '/', {}, 'rack.session' => session
    assert_equal 1, session[:session_id]
    
    session = {}    
    
    get '/', {}, 'rack.session' => session
    assert_equal 2, session[:session_id]    
    
  end  
  
  def teardown    
  end  
  
end
