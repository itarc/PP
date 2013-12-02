require_relative "../../controllers/slideshow"

require 'test/unit'
require 'rack/test'

disable :sessions # Mandatory to test sessions, otherwise we cannot access session object

class TestsSession < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    $user_id = 0
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
  end  
  
end
