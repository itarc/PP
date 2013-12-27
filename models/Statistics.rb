require_relative '../controllers/slideshow.rb'

require 'rack/test'

class GlobalEvaluation
	
  def add_note(note, user_id)
    $db.execute_sql("insert into polls values ('#{Time.now.to_f}', '#{user_id}', 'global_evaluation', #{note})")
  end
  
  def notes
   $db.execute_sql("select distinct on (user_id) response from polls where question_id = 'global_evaluation' order by user_id, timestamp desc").values.map{ |note| note[0].to_i }
  end
  
  def global_evaluation
    return nil if notes == []
    ( notes.reduce(:+) / notes.size.to_f ).round(2)
  end
  
end

class SlideEvaluation
	
  attr_accessor :slide_id
  
  def initialize (slide_id)
    @slide_id = slide_id
  end
	
  def notes
   $db.execute_sql("select distinct on (user_id) response from polls where question_id = '#{@slide_id}' order by user_id, timestamp desc").values.map{ |note| note[0].to_i }
  end  
  
  def add_note(note, user_id)
   $db.execute_sql("insert into polls values ('#{Time.now.to_f}', '#{user_id}', '#{@slide_id}', #{note})")
  end  
  
  def slide_evaluation
    ( notes.reduce(:+) / notes.size.to_f ).round(2)
  end  
	
end

if __FILE__ == $0 then
	
require 'test/unit'
  
class TestsNotes < Test::Unit::TestCase
	
  def setup
    $slide_id = 1
    $user_id_1 = '1'
    $user_id_2 = '2'
    $user_id_3 = '3'
    @slide_evaluation = SlideEvaluation.new($slide_id)
    $db.execute_sql("delete from polls")
  end
  
  def test00

    assert_equal 1, @slide_evaluation.slide_id
	  
  end
	
  def test01

    assert_equal [], @slide_evaluation.notes
	  
  end
  

  def test02
	  
    @slide_evaluation.add_note(1, $user_id_1)
	
    assert_equal [1], @slide_evaluation.notes	  
	  
  end
  
  def test03
	  
    @slide_evaluation.add_note(1, $user_id_1)
    @slide_evaluation.add_note(1, $user_id_2)
	
    assert_equal [1, 1], @slide_evaluation.notes	  
	  
  end  
  
  def test04
    
    @slide_evaluation.add_note(1, $user_id_1)
    @slide_evaluation.add_note(2, $user_id_2)
	
    assert_equal [1, 2], @slide_evaluation.notes

  end
  
  def test05
	  
    @slide_evaluation.add_note(1, $user_id_1)
	  
    assert_equal 1, @slide_evaluation.slide_evaluation	  
	  
  end
  
  def test06
    
    @slide_evaluation.add_note(1, $user_id_1)
    @slide_evaluation.add_note(3, $user_id_2)

    assert_equal 2, @slide_evaluation.slide_evaluation

  end
  
  def test07
    
    @slide_evaluation.add_note(1, $user_id_1)
    @slide_evaluation.add_note(2, $user_id_2)
    @slide_evaluation.add_note(1, $user_id_3)

    assert_equal 1.33, @slide_evaluation.slide_evaluation

  end  
  
  def test08
    
    @slide_evaluation.add_note(1, $user_id_1)
    @slide_evaluation.add_note(3, $user_id_1)

    assert_equal 3, @slide_evaluation.slide_evaluation

  end  

  
end

end