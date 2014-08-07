require_relative "../../controllers/slideshow"

require 'test/unit'
require 'rack/test'

class TestFeatureFlip < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup	  
    $db.execute_sql("delete from flip_values")
  end
  
  def test01_should_be_empty_when_table_is_empty
    get '/admin/flip/asynchronous'
    assert_equal "", last_response.body
  end
  
  def test02_should_be_value_when_created
    post '/admin/flip/asynchronous', {:value => 'true'}
    get '/admin/flip/asynchronous'
    assert_equal "true", last_response.body
  end
  
  def test03_should_be_last_post
    post '/admin/flip/symbol_1', {:value => 'false'}
    post '/admin/flip/symbol_1', {:value => 'true'}
    get '/admin/flip/symbol_1'
    assert_equal "true", last_response.body
  end

  def teardown	  
    $db.execute_sql("delete from flip_values")	  
  end   

end