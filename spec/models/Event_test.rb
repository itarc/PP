require_relative '../../models/Event'
require 'test/unit'

class TestEvent < Test::Unit::TestCase
	
  def test01_should_initialize_event
    event = Event.new('timestamp', 'user_id', 'question_id', 'response')
    assert_equal 'timestamp', event.timestamp
    assert_equal 'user_id', event.user_id
    assert_equal 'question_id', event.question_id
    assert_equal 'response', event.response
  end
  
  def test02_should_give_a_string_representation
    event = Event.new('timestamp', 'user_id', 'question_id', 'response')
    assert_equal event.to_s, ['timestamp', 'user_id', 'question_id', 'response']
  end

end