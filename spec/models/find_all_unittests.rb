#encoding:UTF-8

require_relative '../../models/Poll'
  
require "test/unit"

class TestPollQuestionWithNoResponseGiven < Test::Unit::TestCase
	  
  def setup
    $db.execute_sql("delete from polls")
  end
  
  def test01
    
    assert_equal [], PollQuestion.find_all

  end
  
    def test02

    $db.execute_sql("insert into polls values ('0', '0', '0', '0')")
    
    assert_equal [ ['0', '0', '0', '0'] ], PollQuestion.find_all

  end
  
    def test03

    $db.execute_sql("insert into polls values ('0', '0', '0', '0')")
    $db.execute_sql("insert into polls values ('1', '1', '1', '1')")
    
    assert_equal [  ['0', '0', '0', '0'] , ['1', '1', '1', '1'] ], PollQuestion.find_all

  end  
  
  def teardown
  end

end