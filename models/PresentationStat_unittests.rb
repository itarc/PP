require_relative 'Statistics'
require 'test/unit'

$slide_id_1 = 1
$slide_id_2 = 2

$user_id_1 = '1'
$user_id_2 = '2'
$user_id_3 = '3'

class TestPresentationStat_slides < Test::Unit::TestCase
	
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

class TestPresentationStats_user_stats < Test::Unit::TestCase
	
  def setup
    $db.execute_sql("delete from polls")
    @presentation_stat = PresentationStats.new    
    @user_id = "user"
    @user_id_1 = "user_1"
    @user_id_2 = "user_2"
  end

  def test01_should_be_empty_when_initialized
    assert_equal [], @presentation_stat.user_stats
  end
  
  def test02_should_find_one_user
    @presentation_stat.add_user_stat(UserStat.new(@user_id))
    assert_equal @user_id, @presentation_stat.user_stats[0].user_id
  end
  
  def test03_should_find_one_unique_user  
    @presentation_stat.add_user_stat(UserStat.new(@user_id))
    @presentation_stat.add_user_stat(UserStat.new(@user_id))
    assert_equal 1, @presentation_stat.user_stats.size
    assert_equal @user_id, @presentation_stat.user_stats[0].user_id    
  end
  
  def test04_should_find_two_user_stats
    @presentation_stat.add_user_stat(UserStat.new(@user_id_2))    
    @presentation_stat.add_user_stat(UserStat.new(@user_id_1))
    assert_equal 2, @presentation_stat.user_stats.size    
    assert_equal @user_id_2, @presentation_stat.user_stats[0].user_id
    assert_equal @user_id_1, @presentation_stat.user_stats[1].user_id    
  end
  
  def teardown
    $db.execute_sql("delete from polls")
  end

end