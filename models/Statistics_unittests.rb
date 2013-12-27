require_relative 'Statistics'
require 'test/unit'

$user_1 = '1'
$user_2 = '2'
$user_2 = '3'

class TestsNotes < Test::Unit::TestCase

  def setup
	  
    $db.execute_sql("delete from polls")
    @GlobalEvaluation = GlobalEvaluation.new
	  
  end
  
  def test01

    assert_equal [], @GlobalEvaluation.notes
	
  end

  def test02

    @GlobalEvaluation.add_note(1, $user_1)

    assert_equal [1], @GlobalEvaluation.notes
	  
  end
  
  def test03
	  
    $db.execute_sql("insert into polls values ('0', '0', '0', '0')")

    @GlobalEvaluation.add_note(1, $user_1)

    assert_equal [1], @GlobalEvaluation.notes
	  
  end  
  
  def test04

    @GlobalEvaluation.add_note(1, $user_1)
    @GlobalEvaluation.add_note(2, $user_2)    

    assert_equal [1, 2], @GlobalEvaluation.notes
	  
  end  
  
  def test05

    @GlobalEvaluation.add_note(1, $user_1)
    @GlobalEvaluation.add_note(2, $user_1)    

    assert_equal [2], @GlobalEvaluation.notes
	  
  end
  
  def teardown
	  
    $db.execute_sql("delete from polls")
    
  end  

end
  
class TestsGlobalEvaluation < Test::Unit::TestCase 

  def setup
	  
    $db.execute_sql("delete from polls")
    @GlobalEvaluation = GlobalEvaluation.new
	  
  end
 
  def test01
	  
    assert_equal nil, @GlobalEvaluation.global_evaluation
	  
  end 
 
  def test02
	  
    @GlobalEvaluation.add_note(1, $user_1)
    @GlobalEvaluation.add_note(1, $user_2)  
	  
    assert_equal 1, @GlobalEvaluation.global_evaluation
	  
  end
  
  def test03

    @GlobalEvaluation.add_note(1, $user_1)
    @GlobalEvaluation.add_note(2, $user_2)  
	  
    assert_equal 1.5, @GlobalEvaluation.global_evaluation
	  
  end
  
  def test04

    @GlobalEvaluation.add_note(1, $user_1)
    @GlobalEvaluation.add_note(2, $user_2)
    @GlobalEvaluation.add_note(3, $user_3)
	  
    assert_equal 2, @GlobalEvaluation.global_evaluation
    
  end
  
  def test05

    @GlobalEvaluation.add_note(1, $user_1)
    @GlobalEvaluation.add_note(2, $user_2)
    @GlobalEvaluation.add_note(1, $user_3)
	  
    assert_equal 1.33, @GlobalEvaluation.global_evaluation
    
  end  
  
  def test06

    @GlobalEvaluation.add_note(1, $user_1)
    @GlobalEvaluation.add_note(2, $user_1)
    @GlobalEvaluation.add_note(3, $user_1)
	  
    assert_equal 3, @GlobalEvaluation.global_evaluation
    
  end  

  def teardown
	  
    $db.execute_sql("delete from polls")
    
  end
  
end
