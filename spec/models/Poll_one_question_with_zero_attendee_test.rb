#encoding:UTF-8

require_relative '../../models/Poll'
  
require "test/unit"

$user_id_1 = "user_1"
$user_id_2 = "user_2"
$user_id_3 = "user_3"
$question_id_1 = "Unix est il un système ?"
$question_id_2 = "Unix est il réparti ?"
$answer_1 = "Oui"
$answer_2 = "Non"

class TestPollQuestionWithNoResponseGiven < Test::Unit::TestCase
	  
  def setup
    $db.execute_sql("delete from polls")
    $poll_question = PollQuestion.new($question_id_1)
  end

  def test00
    assert_equal [], $poll_question.possible_responses
  end

  def test01
    expected = { }
    assert_equal expected, $poll_question.users_for_each_answer
  end

  def test02
    assert_equal 0, $poll_question.total_number_of_users
  end

  def test03
    assert_equal 0, $poll_question.total_number_of_users_for( $answer_1)
  end

  def test04
    assert_equal 0, $poll_question.rate_for( $answer_1)
  end    

  def test05
    expected = { $question_id_1 => { } }
    assert_equal expected, $poll_question.rates
  end

  def teardown
    $db.execute_sql("delete from polls")
  end

end