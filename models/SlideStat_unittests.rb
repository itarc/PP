require_relative 'Statistics'

require 'test/unit'

class TestsSlideRating_initialization < Test::Unit::TestCase
	
  def setup
    @slide_id = "slide_id"
    @user_id = "user_1"
    @rating = 1
    @user_ratings = { @user_id => @rating }
  end
	
  def test01
    assert_equal @slide_id, SlideRating.new(@slide_id, @user_ratings).slide_id
  end
  
  def test01
    assert_equal @user_ratings, SlideRating.new(@slide_id, @user_ratings).user_ratings
  end
	
end

class TestsSlideRating_find_all < Test::Unit::TestCase
	
  def setup
    $db.execute_sql("delete from polls")	  
    @slide_id = "slide_1_evaluation"
    @user_id = "user_1"
    @rating = 5
    @user_ratings = { @user_id => @rating }
  end
	
  def test01_should_be_empty_when_database_is_empty
    assert_equal [], SlideRating.find_all
  end
    
  def test02_should_find_one_slide_rating
    SlideRating.new(@slide_id, @user_ratings ).save
    assert_equal 1, SlideRating.find_all.size    
    assert_equal @rating, SlideRating.find_all[0].user_rating(@user_id)
  end

  def test03_should_find_two_slide_ratings
    SlideRating.new(@slide_id, @user_ratings ).save
    SlideRating.new("slide_2_evaluation", {"another_user" => 0 } ).save
    assert_equal 2, SlideRating.find_all.size
    assert_equal @rating, SlideRating.find_all[0].user_rating(@user_id)
    assert_equal 0, SlideRating.find_all[1].user_rating("another_user")
  end
  
  def test04_should_find_one_slide_rating_with_two_ratings_from_different_users
    SlideRating.new(@slide_id, @user_ratings ).save
    SlideRating.new(@slide_id, {"another_user" => 0 } ).save
    assert_equal 1, SlideRating.find_all.size    
    assert_equal @rating, SlideRating.find_all[0].user_rating(@user_id)
    assert_equal 0, SlideRating.find_all[0].user_rating("another_user")
  end  

  def test05_should_only_select_slide_with_evaluation_in_id
    SlideRating.new("x", @user_ratings ).save
    assert_equal 0, SlideRating.find_all.size    
  end  

  def teardown
    $db.execute_sql("delete from polls")	  
  end
	
end

class TestsGlobalRating_find < Test::Unit::TestCase
  
  def test01_should_be_nil_when_initialized
    assert_equal ({}), GlobalRating.find.user_ratings
  end
  
  def test02_should_find_one_user_global_rating
    @user_ratings = {"user_id" => 1}
    GlobalRating.new(@user_ratings).save
    assert_equal 1, GlobalRating.find.user_ratings["user_id"]
  end  
  
  def test02_should_find_lattest_user_global_rating
    @user_ratings = {"user_id" => 1}
    GlobalRating.new(@user_ratings).save
    @user_ratings = {"user_id" => 2}
    GlobalRating.new(@user_ratings).save    
    assert_equal 2, GlobalRating.find.user_ratings["user_id"]
  end   
  
end

#~ require_relative 'Statistics'
#~ require 'test/unit'

#~ $slide_id_1 = 1
#~ $slide_id_2 = 2

#~ $user_id_1 = '1'
#~ $user_id_2 = '2'
#~ $user_id_3 = '3'
  
#~ class TestSlideStat_rating < Test::Unit::TestCase 

  #~ def setup
    #~ $db.execute_sql("delete from polls")
    #~ @slide_stat = SlideStat.new($slide_id_1)
  #~ end
 
  #~ def test01_should_be_nil_when_initialized
    #~ assert_equal nil, @slide_stat.rating
  #~ end 
 
  #~ def test02_should_compute_integer_rating
    #~ @slide_stat.add_grade(1, $user_id_1)
    #~ @slide_stat.add_grade(1, $user_id_2)  
    #~ assert_equal 1, @slide_stat.rating
  #~ end
  
  #~ def test03_should_compute_float_rating
    #~ @slide_stat.add_grade(1, $user_id_1)
    #~ @slide_stat.add_grade(2, $user_id_2)  
    #~ assert_equal 1.5, @slide_stat.rating
  #~ end
  
  #~ def test05_should_round_to_two_digits_max
    #~ @slide_stat.add_grade(1, $user_id_1)
    #~ @slide_stat.add_grade(2, $user_id_2)
    #~ @slide_stat.add_grade(1, $user_id_3)
    #~ assert_equal 1.33, @slide_stat.rating
  #~ end  
  
  #~ def test06_should_keep_user_last_grades_only
    #~ @slide_stat.add_grade(1, $user_id_1)
    #~ @slide_stat.add_grade(3, $user_id_1)
    #~ @slide_stat.add_grade(3, $user_id_2)
    #~ assert_equal 3, @slide_stat.rating
  #~ end  

  #~ def teardown
    #~ $db.execute_sql("delete from polls")
  #~ end
  
#~ end