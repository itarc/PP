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

class TestsSlideStatGrades < Test::Unit::TestCase

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
  
class TestSlideStatRating < Test::Unit::TestCase 

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

class TestPresentationStatSlides < Test::Unit::TestCase
	
  def setup
    $db.execute_sql("delete from polls")	  
    @presentation_stat = PresentationStats.new
  end

  def test01_should_be_empty_when_initialized
    assert_equal [], @presentation_stat.slides
  end
  
  def test02_should_find_one_slide
    @presentation_stat.add_slide("1")
    assert_equal ["1"], @presentation_stat.slides
  end
  
  def test03_should_find_two_slides
    @presentation_stat.add_slide("1")
    @presentation_stat.add_slide("2")
    assert_equal ["1", "2"], @presentation_stat.slides
  end  
  
  def test04_should_select_rating_slides_only
    @presentation_stat.add_slide("1")
    @presentation_stat.add_slide("slide_x_evaluation")
    assert_equal ["slide_x_evaluation"], @presentation_stat.rating_slides   
  end
  
  def test05_should_include_global_evaluation
    @presentation_stat.add_slide("1")
    @presentation_stat.add_slide("global_evaluation")
    assert_equal ["global_evaluation"], @presentation_stat.rating_slides   
  end  
  
  def test06_should_select_unique_slide_names
    @presentation_stat.add_slide("1")
    @presentation_stat.add_slide("1")
    assert_equal ["1"], @presentation_stat.slides
  end  
  
  def teardown
    $db.execute_sql("delete from polls")
  end

end

class TestPresentationStatsUsers < Test::Unit::TestCase
	
  def setup
    $db.execute_sql("delete from polls")
    @user_id = "user"
    @user_id_1 = "user_1"
    @user_id_2 = "user_2"
  end

  def test01_should_be_empty_when_initialized
    user_stats = PresentationStats.new
    assert_equal [], user_stats.users
  end
  
  def test02_should_finf_one_user
    user_stats = PresentationStats.new
    user_stats.add_user(@user_id)
    assert_equal [@user_id], user_stats.users
  end
  
  def test03_should_find_one_unique_user
    user_stats = PresentationStats.new	  
    user_stats.add_user(@user_id)    
    user_stats.add_user(@user_id)
    assert_equal [@user_id], user_stats.users
  end
  
  def test04_should_find_two_users
    user_stats = PresentationStats.new	  
    user_stats.add_user(@user_id_2)    
    user_stats.add_user(@user_id_1)	  
    assert_equal [@user_id_1, @user_id_2], user_stats.users
  end
  
  def teardown
    $db.execute_sql("delete from polls")
  end

end

class TestsUserStatGrades < Test::Unit::TestCase

  def setup
    $db.execute_sql("delete from polls")
    @user_id = "user"
    @user_id_1 = "user_1"
    @user_id_2= "user_2"
  end
  
  def test01_should_be_empty_when_initialized
    user_stat = UserStat.new(@user_id)
    assert_equal [], user_stat.grades
  end
  
  def test02_shiould_find_one_grade
    user_stat = UserStat.new(@user_id)
    user_stat.add_grade("1")
    assert_equal ["1"], user_stat.grades
  end
  
  def test03_should_find_one_grade_for_each_user
    user_stat_1 = UserStat.new(@user_id_1)
    user_stat_2 = UserStat.new(@user_id_2)
    user_stat_1.add_grade("1")
    user_stat_2.add_grade("2")
    assert_equal ["1"], user_stat_1.grades
    assert_equal ["2"], user_stat_2.grades
  end
  
  def test04_should_take_lattest_grade_for_a_given_slide
    user_stat = UserStat.new(@user_id)
    user_stat.add_grade("1")
    user_stat.add_grade("2")
    assert_equal ["2"], user_stat.grades    
  end
  
  def teardown
    $db.execute_sql("delete from polls")
  end  
  
end

class TestsUserStatProfile < Test::Unit::TestCase
	
  def setup
    $db.execute_sql("delete from polls")
    @user_id = "user"
    @user_stat = UserStat.new(@user_id)    
  end

  def test01_should_be_empty_when_initialized
    assert_equal [], @user_stat.profile
  end
  
  def test02_should_have_no_questions_when_initialized
    assert_equal [], @user_stat.questions
  end
  
  def test03_should_find_one_question  
    @user_stat.add_question("$informaticien_question")
    assert_equal ["$informaticien_question"], @user_stat.questions
  end
  
  def test04_should_not_find_a_question
    @user_stat.add_question("x")
    assert_equal [], @user_stat.questions
  end  
  
  def test030_should_find_a_unique_question
    @user_stat.add_question("$informaticien_question")
    @user_stat.add_question("$informaticien_question")
    assert_equal ["$informaticien_question"], @user_stat.questions
  end 
  
  def test05_should_find_nil_response_to
    assert_equal nil, @user_stat.response_to("$informaticien_question")
  end
  
  def test06_should_find_a_response_to
    @user_stat.add_response("$informaticien_question", "oui")	  
    assert_equal "oui", @user_stat.response_to("$informaticien_question")
  end   

  def test07_should_find_a_response_for_each_user
    user_stat_other = UserStat.new("another_user")
    user_stat_other.add_response("$informaticien_question", "non")
    @user_stat.add_response("$informaticien_question", "oui")
    assert_equal "non", user_stat_other.response_to("$informaticien_question")
    assert_equal "oui", @user_stat.response_to("$informaticien_question")
  end 

  def test08_should_find_a_question
    @user_stat.add_response("$informaticien_question", "oui")
    assert_equal [["$informaticien_question", "oui"]], @user_stat.profile
  end
  
  def test09_should_find_another_question
    @user_stat.add_response("$cloud_computing_question", "oui")
    assert_equal [["$cloud_computing_question", "oui"]], @user_stat.profile
  end
  
  def test10_should_find_two_questions
    @user_stat.add_response("$informaticien_question", "oui")	  
    @user_stat.add_response("$cloud_computing_question", "oui")
    assert_equal [["$informaticien_question", "oui"], ["$cloud_computing_question", "oui"]], @user_stat.profile
  end

  def teardown
    $db.execute_sql("delete from polls")
  end  

end

