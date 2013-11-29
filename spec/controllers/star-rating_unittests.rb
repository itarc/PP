require_relative "../../controllers/slideshow"

require 'test/unit'
require 'rack/test'

class TestStarRating < Test::Unit::TestCase
  
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end
  
  def setup
    $db.execute_sql("delete from polls") 
  end  
  
  def test01_should_save_a_rating_of_1

    post '/rating_input_1_to_global_evaluation'
    assert last_response.ok?, last_response.errors
    
    assert_equal 1, db_rating
    
  end
  
  def test01_should_save_a_rating_of_2

    post '/rating_input_2_to_global_evaluation'
    assert last_response.ok?, last_response.errors
    
    assert_equal 2, db_rating
    
  end  
  
  def teardown    
  end  
  
end

# ---- HELPERS

def db_rating
  $db.execute_sql("select * from polls")[0]["response"].to_i
end
