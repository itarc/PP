require_relative 'Statistics'
require 'test/unit'

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

class TestPresentationStats_profile_response_map < Test::Unit::TestCase

  def setup
    $db.execute_sql("delete from polls")
    @presentation_stat = PresentationStats.new
  end

  def test01_should_be_empty_when_initialized
    assert_equal ({}), @presentation_stat.profile_response_map
  end
  
  def test02_should_find_one_profile_response_map
    @presentation_stat.profile_response_map = {["a", "1"] => "x"}
    assert_equal ({["a", "1"] => "x"}), @presentation_stat.profile_response_map
  end  

  def test03_should_map_profile_responses
    @presentation_stat.profile_response_map = {["question", "response"] => "profile"}
    @presentation_stat.add_user_stat(UserStat.new(@user_id))
    @presentation_stat.user_stats[0].user_profile.add_response("question", "response")
    assert_equal ["profile"], @presentation_stat.user_stats[0].profile
  end 
  
  def teardown
    $db.execute_sql("delete from polls")
  end

end
