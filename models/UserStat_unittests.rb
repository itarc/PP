require_relative 'Statistics'
require 'test/unit'

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
  
  def test02_should_find_two_user_stats_in_ascending_order
    UserStat.new("B").save
    UserStat.new("A").save
    all_user_stats = UserStat.find_all
    assert_equal 2, all_user_stats.size
    assert_equal "A", all_user_stats[0].user_id
    assert_equal "B", all_user_stats[1].user_id
  end  
  
  def teardown
    $db.execute_sql("delete from polls")	  
  end
  
end

class TestsUserStat_slide_ratings < Test::Unit::TestCase
	
  def setup
    $db.execute_sql("delete from polls")	  
    @user_id = "user_id"
    @slide_id = "slide_1_evaluation"
    @rate = 2
    @user_stat = UserStat.new(@user_id)
  end
  
  def test01_should_be_empty_when_initialized
    assert_equal [], @user_stat.slide_ratings
  end
  
  def test02_should_find_one_slide_rating
    SlideRating.new(@slide_id, {@user_id => @rate}).save
    assert_equal 1, @user_stat.slide_ratings.size
    assert_equal @slide_id, @user_stat.slide_ratings[0].slide_id
    assert_equal @rate, @user_stat.slide_ratings[0].user_rating(@user_id)
  end
  
  def test03_should_find_one_slide_rating_for_each_user
    SlideRating.new(@slide_id, {@user_id => @rate}).save
    SlideRating.new(@slide_id, {"another_user" => 0}).save
    assert_equal 1, @user_stat.slide_ratings.size
    assert_equal @slide_id, @user_stat.slide_ratings[0].slide_id
    assert_equal @rate, @user_stat.slide_ratings[0].user_rating(@user_id)
  end  
  
  def teardown
    $db.execute_sql("delete from polls")	  
  end

end

class TestsUserStat_global_rating < Test::Unit::TestCase

  def setup
    @user_id = "user_id"
    @user_stat = UserStat.new(@user_id )	  
  end

  def test01_should_be_nil_when_initialized
    assert_equal nil, @user_stat.global_user_rating
  end
  
  def test02_should_find_one_user_global_rating
    GlobalRating.new({@user_id  => 1}).save
    assert_equal 1, @user_stat.global_user_rating
  end  

  def test02_should_find_lattest_user_global_rating
    GlobalRating.new({@user_id  => 1}).save
    GlobalRating.new({@user_id  => 2}).save
    assert_equal 2, @user_stat.global_user_rating
  end  

end

# --- A supprimer ??

class TestsUserStat_profile_responses < Test::Unit::TestCase
	
  def setup
    $db.execute_sql("delete from polls")
    @user_stat = UserStat.new("user_id") 
  end

  def test01_should_be_empty_when_initialized
    assert_equal [], @user_stat.profile_responses
  end

  def test02_should_find_one_question
    @user_stat.user_profile.add_response("$informaticien_question", "oui")
    assert_equal [["$informaticien_question", "oui"]], @user_stat.profile_responses
  end
  
  def test03_should_find_two_questions
    @user_stat.user_profile.add_response("$informaticien_question", "oui")	  
    @user_stat.user_profile.add_response("$cloud_computing_question", "oui")
    assert_equal [["$informaticien_question", "oui"], ["$cloud_computing_question", "oui"]], @user_stat.profile_responses
  end
  
  def teardown
    $db.execute_sql("delete from polls")
  end    
  
end
  
class TestsUserStat_profile < Test::Unit::TestCase
	
  def setup
    $db.execute_sql("delete from polls")
    @user_stat = UserStat.new("user_id") 
  end	
  
  def test01_should_not_map_profile
    @user_stat.user_profile.add_response("$cloud_computing_question", "oui")
    assert_equal [["$cloud_computing_question", "oui"]], @user_stat.profile
  end

  def test02_should_map_profile
    @user_stat.user_profile.add_response("$cloud_computing_question", "oui")
    @user_stat.user_profile.add_response_map({["$cloud_computing_question", "oui"] => "cloud_computing"})    
    assert_equal ["cloud_computing"], @user_stat.profile
  end

  def teardown
    $db.execute_sql("delete from polls")
  end  

end

