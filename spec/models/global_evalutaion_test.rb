#encoding:UTF-8

require_relative '../../models/Poll'
  
require "test/unit"

class TestPollQuestionWithNoResponseGiven < Test::Unit::TestCase
	  
  def setup
    $db.execute_sql("delete from polls")
  end
  
  def test01
    
    assert_equal nil, PollQuestion.global_evaluation

  end
  
  def test02

    $db.execute_sql("insert into polls values ('0', '0', '0', '0')")
    
    assert_equal nil, PollQuestion.global_evaluation

  end
  
  def test03

    $db.execute_sql("insert into polls values ('0', '0', '0', '0')")
    $db.execute_sql("insert into polls values ('1', '1', 'global_evaluation', '5')")

    assert_equal 5, PollQuestion.global_evaluation

  end  
  
  def test04_should_keep_only_last_answer

    $db.execute_sql("insert into polls values ('1', '1', 'global_evaluation', '1')")
    $db.execute_sql("insert into polls values ('2', '1', 'global_evaluation', '5')")    

    assert_equal 5, PollQuestion.global_evaluation

  end 
  
  
  def test06

    $db.execute_sql("insert into polls values ('t1', '1', 'global_evaluation', '5')")
    $db.execute_sql("insert into polls values ('t2', '2', 'global_evaluation', '1')")    

    assert_equal 3, PollQuestion.global_evaluation

  end
  
  
  def test06

    $db.execute_sql("insert into polls values ('t1', '1', 'global_evaluation', '5')")
    $db.execute_sql("insert into polls values ('t2', '2', 'global_evaluation', '3')")    
    $db.execute_sql("insert into polls values ('t3', '3', 'global_evaluation', '2')")    

    assert_equal 3.33, PollQuestion.global_evaluation

  end  

  def teardown
    $db.execute_sql("delete from polls")	  
  end

end