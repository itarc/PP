require_relative 'Statistics'
require 'test/unit'

$slide_id_1 = 1
$slide_id_2 = 2

$user_id_1 = '1'
$user_id_2 = '2'
$user_id_3 = '3'

class TestsUserStat_initialize < Test::Unit::TestCase
	
  def test01_should_initialize_user_id
    user_stat = UserStat.new(@user_id)
    assert_equal @user_id, user_stat.user_id
  end
  
end

class TestsUserStat_find_all < Test::Unit::TestCase

  def setup
    $db.execute_sql("delete from polls")
    @user_id = "user_id"    
  end

  def test01_should_be_empty_when_database_is_empty
    all_user_stats = UserStat.find_all
    assert_equal [], all_user_stats
  end
  
  def test02_should_find_one_user_stat
    UserStat.new(@user_id).save
    all_user_stats = UserStat.find_all
    assert_equal 1, all_user_stats.size
    assert_equal @user_id, all_user_stats[0].user_id
  end
  
  def teardown
    $db.execute_sql("delete from polls")	  
  end
  
end

class TestsUserStat_grades < Test::Unit::TestCase

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

class TestsUserStat_profile < Test::Unit::TestCase
	
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
  
  def test11
    @user_stat.add_response("$cloud_computing_question", "oui")  
    assert_equal [["$cloud_computing_question", "oui"]], @user_stat.mapped_profile
  end

  def test12
    @user_stat.add_response("$cloud_computing_question", "oui")
    @user_stat.add_map({["$cloud_computing_question", "oui"] => "cloud_computing"})    
    assert_equal ["cloud_computing"], @user_stat.mapped_profile
  end

  def teardown
    $db.execute_sql("delete from polls")
  end  

end

$slide_1_evaluation="slide_1_evaluation"
$slide_2_evaluation="slide_2_evaluation"
$slide_3_NO_evaluation="x"

class TestUserStat_slide_grades < Test::Unit::TestCase
	
  def setup
    @user_stat = UserStat.new("user_1")
    $db.execute_sql("delete from polls")    
  end
	
  def test01_should_be_empty_when_initialized
    assert_equal [], @user_stat.slide_grades
  end	

  def test02_should_find_one_slide_grade
    @user_stat.add_slide_grade([$slide_1_evaluation, "1"])
    assert_equal [[$slide_1_evaluation, "1"]], @user_stat.slide_grades	  
  end
  
  def test03_should_find_two_slide_grades
    @user_stat.add_slide_grade([$slide_1_evaluation, "1"])
    @user_stat.add_slide_grade([$slide_2_evaluation, "2"])
    assert_equal [[$slide_1_evaluation, "1"], [$slide_2_evaluation, "2"]], @user_stat.slide_grades	  
  end  

  #~ def test030_should_find_slides_grades_in_time_order
    #~ @user_stat.add_slide_grade(["b_evaluation", "2"])	  
    #~ @user_stat.add_slide_grade(["a_evaluation", "1"])
    #~ assert_equal [["b", "1"], ["a", "2"]], @user_stat.slide_grades	  
  #~ end 
  
  def test04_should_find_slide_grade_for_a_specific_user_only
    @user_stat.add_slide_grade([$slide_1_evaluation, "1"])
    another_user_stat = UserStat.new("user_2")    
    another_user_stat.add_slide_grade([$slide_2_evaluation, "2"])
    assert_equal [[$slide_1_evaluation, "1"]], @user_stat.slide_grades    
    assert_equal [[$slide_2_evaluation, "2"]], another_user_stat.slide_grades    
  end
  
  def test05_shoud_find_lattest_slide_grade
    @user_stat.add_slide_grade([$slide_1_evaluation, "1"])
    @user_stat.add_slide_grade([$slide_1_evaluation, "2"])
    assert_equal [[$slide_1_evaluation, "2"]], @user_stat.slide_grades	     
  end
  
  def test06_should_only_take_evaluation_slides
    @user_stat.add_slide_grade([$slide_1_evaluation, "1"])
    @user_stat.add_slide_grade([$slide_3_NO_evaluation, ""])
    assert_equal [[$slide_1_evaluation, "1"]], @user_stat.slide_grades    
  end
  
  def teardown
    $db.execute_sql("delete from polls")
  end  

end