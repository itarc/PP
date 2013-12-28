require_relative 'Statistics'
require 'test/unit'

$slide_id_1 = 1
$slide_id_2 = 2

$user_id_1 = '1'
$user_id_2 = '2'
$user_id_3 = '3'

class TestsSlideStatInitialization < Test::Unit::TestCase

  def test00_should_initialize_slide_id
    @slide_stat = SlideStat.new($slide_id_1)
    assert_equal $slide_id_1, @slide_stat.slide_id
  end  

end

class TestsGrades < Test::Unit::TestCase

  def setup
    $db.execute_sql("delete from polls")
    @slide_stat = SlideStat.new($slide_id_1)
  end
  
  def test01_should_be_empty_when_initialized
    assert_equal [], @slide_stat.grades
  end

  def test02_should_have_one_grade
    @slide_stat.add_grade(1, $user_id_1)
    assert_equal [1], @slide_stat.grades
  end
  
  def test03_should_have_two_grades
    @slide_stat.add_grade(1, $user_id_1)
    @slide_stat.add_grade(2, $user_id_2)    
    assert_equal [1, 2], @slide_stat.grades
  end  
  
  def test04_should_keep_user_last_grade_only
    @slide_stat.add_grade(1, $user_id_1)
    @slide_stat.add_grade(2, $user_id_1)    
    assert_equal [2], @slide_stat.grades
  end  
  
  def test05_should_select_grades_of_slide_only
    slide_stat_2 = SlideStat.new($slide_id_2)
    slide_stat_2.add_grade(2, $user_id_1)
    assert_equal [2], slide_stat_2.grades
    @slide_stat.add_grade(1, $user_id_2)
    assert_equal [1], @slide_stat.grades
  end
  
  def teardown
    $db.execute_sql("delete from polls")
  end  

end
  
class TestRating < Test::Unit::TestCase 

  def setup
    $db.execute_sql("delete from polls")
    @slide_stat = SlideStat.new($slide_id_1)
  end
 
  def test01_should_be_nil_when_initialized
    assert_equal nil, @slide_stat.rating
  end 
 
  def test02_should_compute_integer_rating
    @slide_stat.add_grade(1, $user_id_1)
    @slide_stat.add_grade(1, $user_id_2)  
    assert_equal 1, @slide_stat.rating
  end
  
  def test03_should_compute_float_rating
    @slide_stat.add_grade(1, $user_id_1)
    @slide_stat.add_grade(2, $user_id_2)  
    assert_equal 1.5, @slide_stat.rating
  end
  
  def test05_should_round_to_two_digits_max
    @slide_stat.add_grade(1, $user_id_1)
    @slide_stat.add_grade(2, $user_id_2)
    @slide_stat.add_grade(1, $user_id_3)
    assert_equal 1.33, @slide_stat.rating
  end  
  
  def test06_should_keep_user_last_grades_only
    @slide_stat.add_grade(1, $user_id_1)
    @slide_stat.add_grade(3, $user_id_1)
    @slide_stat.add_grade(3, $user_id_2)
    assert_equal 3, @slide_stat.rating
  end  

  def teardown
    $db.execute_sql("delete from polls")
  end
  
end

