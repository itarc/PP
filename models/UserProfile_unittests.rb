require_relative 'Statistics'
require 'test/unit'

class TestsUserProfile_questions < Test::Unit::TestCase

  def setup
    $db.execute_sql("delete from polls")
    @user_id = "user"
    @profile = UserProfile.new(@user_id)    
  end
	
  def test01_should_have_no_questions_when_initialized
    assert_equal [], @profile.questions
  end
  
  def test02_should_find_one_question  
    @profile.add_question("$informaticien_question")
    assert_equal ["$informaticien_question"], @profile.questions
  end
  
  def test03_should_not_find_a_question
    @profile.add_question("x")
    assert_equal [], @profile.questions
  end  
  
  def test04_should_find_a_unique_question
    @profile.add_question("$informaticien_question")
    @profile.add_question("$informaticien_question")
    assert_equal ["$informaticien_question"], @profile.questions
  end 
  
  def test05_should_find_nil_response_to
    assert_equal nil, @profile.response_to("$informaticien_question")
  end
  
  def test06_should_find_a_response_to
    @profile.add_response("$informaticien_question", "oui")	  
    assert_equal "oui", @profile.response_to("$informaticien_question")
  end   

  def test07_should_find_a_response_for_each_user
    @profile.add_response("$informaticien_question", "oui")	  
    other_profile = UserProfile.new("another_user")
    other_profile.add_response("$informaticien_question", "non")
    assert_equal "non", other_profile.response_to("$informaticien_question")
    assert_equal "oui", @profile.response_to("$informaticien_question")
  end  
  
  def test08_should_add_a_response_map
    assert_equal ({}), @profile.response_map
    @profile.add_response_map({["$cloud_computing_question", "oui"] => "cloud_computing"})
    assert_equal ({["$cloud_computing_question", "oui"] => "cloud_computing"}), @profile.response_map
  end

  def teardown
    $db.execute_sql("delete from polls")
  end 
  
end