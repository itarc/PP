require_relative "../../controllers/slideshow"

require 'test/unit'
require 'rack/test'

class TestStarSelection < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    $db.execute_sql("delete from polls") 
  end  
  
  def test01_should_save_a_selection

    post '/select_input_1_to_proposition'
    assert last_response.ok?, last_response.errors
    
    assert_equal 1, db_rating
    
  end
  
  def teardown    
  end  
  
end

# ---- HELPERS

def db_rating
  $db.execute_sql("select * from polls")[0]["response"].to_i
end
