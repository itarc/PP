#encoding:UTF-8

require_relative '../../models/Poll'
  
require "test/unit"

$user_id_1 = "user_1"
$user_id_2 = "user_2"
$user_id_3 = "user_3"
$question_id_1_1 = "Unix est il un système ?"
$question_id_1_2 = "Unix est il réparti ?"
$answer_1 = "Oui"
$answer_2 = "Non"

class TestPollWithOneAttendeeAndTwoQuestions < Test::Unit::TestCase

  def setup
    $db.execute_sql("delete from polls")
    $poll_question_1 = PollQuestion.new($question_id_1)
    $poll_question_1.add_a_choice($user_id_1, $answer_1) 
    $poll_question_2 = PollQuestion.new($question_id_2)
    $poll_question_2.add_a_choice($user_id_1, $answer_1)
  end

  def test00
    assert_equal [$answer_1], $poll_question_1.possible_responses
    assert_equal [$answer_1], $poll_question_2.possible_responses
  end    

  def test01
    expected = { $answer_1 => [$user_id_1] }
    assert_equal     expected, $poll_question_1.users_for_each_answer
    expected = { $answer_1 => [$user_id_1] }      
    assert_equal     expected, $poll_question_2.users_for_each_answer
  end

  def test02
    assert_equal 1, $poll_question_1.total_number_of_users
    assert_equal 1, $poll_question_2.total_number_of_users
  end

  def test03
    assert_equal 1, $poll_question_1.total_number_of_users_for($answer_1)
    assert_equal 1, $poll_question_2.total_number_of_users_for($answer_1)
  end

  def test04
    assert_equal 100, $poll_question_1.rate_for($answer_1)
    assert_equal 100, $poll_question_2.rate_for($answer_1)
  end

  def test05
    expected = { $question_id_1 => { $answer_1.to_s => 100 } }
    assert_equal     expected, $poll_question_1.rates      
    expected = { $question_id_2 => { $answer_1.to_s => 100 } }
    assert_equal     expected, $poll_question_2.rates
  end

  def teardown
    $db.execute_sql("delete from polls")
  end    

end