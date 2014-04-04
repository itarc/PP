require_relative '../../models/RunTime'
require 'test/unit'

require 'time'

class TestRunTimeEvent < Test::Unit::TestCase
  
  def setup
    $db.execute_sql("delete from run_events")
  end
  
  def test01_initialization
    runtime_event = RunTimeEvent.new("user", type="run", slide_index = "slide_0", code_input = "print 1", code_output = "1")
    assert_nothing_raised { Time.at(runtime_event.timestamp) }
    assert_equal  "user", runtime_event.user
    assert_equal  "run", runtime_event.type
    assert_equal  "slide_0", runtime_event.slide_index    
    assert_equal  "print 1", runtime_event.code_input
    assert_equal  "1", runtime_event.code_output
    assert_equal (["user", "run", "slide_0", "print 1", "1"]).inspect, runtime_event.to_s
  end
  
  def test02_time_stamp_initialization
    runtime_event = RunTimeEvent.new("user", type="run", slide_index = "slide_0" ,code_input = "print 1", code_output = "1")
    assert_nothing_raised { Time.at(runtime_event.timestamp) }
    runtime_event = RunTimeEvent.new("user", type="run", slide_index = "slide_0", code_input = "print 1", code_output = "1", timestamp = "x")    
    assert_equal "x", runtime_event.timestamp
  end

end
  
class TestRunTimeEvent_find < Test::Unit::TestCase 
  
  def setup
    $db.execute_sql("delete from run_events")
  end  

  def test00_should_not_raise_an_error_when_quotes_in_strings
    assert_nothing_raised { RunTimeEvent.new("user_1", type="run", slide_index = "slide_0" ,code_input = "'string in simple quotes 1'", code_output = "").save }
  end
  
  def test01_should_find_an_empty_list_when_no_runtime_events
    assert_equal [], RunTimeEvent.find_all
  end  
  
  def test02_should_find_a_list_with_one_runtime_event
    RunTimeEvent.new("user", type="run", slide_index = "slide_0" ,code_input = "print 3", code_output = "3", timestamp = 'timestamp').save
    runtime_events = RunTimeEvent.find_all
    assert_equal 1, runtime_events.size
    assert_equal ([["user", "run", "slide_0", "print 3", "3"]]).inspect, runtime_events.inspect
    assert_equal "timestamp", runtime_events[0].timestamp
  end  

  def test03_should_find_a_list_with_two_runtime_event_in_the_order_they_have_been_inserted
    RunTimeEvent.new("user_2", type="run", slide_index = "slide_0" ,code_input = "print 5", code_output = "5", timestamp = 'timestamp').save
    RunTimeEvent.new("user_1", type="run", slide_index = "slide_0" ,code_input = "print 4", code_output = "4", timestamp = 'timestamp').save
    runtime_events = RunTimeEvent.find_all
    assert_equal 2, runtime_events.size
    assert_equal ([["user_2", "run", "slide_0", "print 5", "5"], ["user_1", "run", "slide_0", "print 4", "4"]]).inspect, runtime_events.inspect
    assert_equal "timestamp", runtime_events[0].timestamp
  end

  def teardown
    $db.execute_sql("delete from run_events")
  end

end

class TestRunTimeEvent_find_last_execution_in_attendee_slide < Test::Unit::TestCase 

  def setup
    $db.execute_sql("delete from run_events")
  end
  
  def test01_should_find_nil_when_no_execution_in_database
    assert_equal nil, RunTimeEvent.find_last_user_execution_on_slide("user", "slide_0")
  end 
  
  def test02_should_find_last_send
    RunTimeEvent.new("user", type="run", slide_index = "slide_0" ,code_input = "print 1", code_output = "1", timestamp = '1').save
    RunTimeEvent.new("user", type="run", slide_index = "slide_0" ,code_input = "print 2", code_output = "2", timestamp = '2').save
    RunTimeEvent.new("user", type="send", slide_index = "slide_0" ,code_input = "print 3", code_output = "3", timestamp = '3').save
    RunTimeEvent.new("user", type="send", slide_index = "slide_0" ,code_input = "print 4", code_output = "4", timestamp = '4').save
    runtime_events = RunTimeEvent.find_last_user_execution_on_slide("user", "slide_0")
    assert_equal (["user", "send", "slide_0", "print 4", "4"]).inspect, runtime_events.inspect
  end
  
  def test03_should_find_last_run
    RunTimeEvent.new("user", type="send", slide_index = "slide_0" ,code_input = "print 1", code_output = "1", timestamp = '1').save
    RunTimeEvent.new("user", type="send", slide_index = "slide_0" ,code_input = "print 2", code_output = "2", timestamp = '2').save    
    RunTimeEvent.new("user", type="run", slide_index = "slide_0" ,code_input = "print 3", code_output = "3", timestamp = '3').save
    RunTimeEvent.new("user", type="run", slide_index = "slide_0" ,code_input = "print 4", code_output = "4", timestamp = '4').save
    runtime_events = RunTimeEvent.find_last_user_execution_on_slide("user", "slide_0")
    assert_equal (["user", "run", "slide_0", "print 4", "4"]).inspect, runtime_events.inspect
  end  
  
  def test04_should_find_last_run_for_the_right_slide
    RunTimeEvent.new("user", type="run", slide_index = "slide_0" ,code_input = "print 3", code_output = "3", timestamp = '3').save
    RunTimeEvent.new("user", type="run", slide_index = "slide_1" ,code_input = "print 4", code_output = "4", timestamp = '4').save
    runtime_events = RunTimeEvent.find_last_user_execution_on_slide("user", "slide_0")
    assert_equal (["user", "run", "slide_0", "print 3", "3"]).inspect, runtime_events.inspect
  end 

  def test05_should_find_last_run_for_the_right_user
    RunTimeEvent.new("user", type="run", slide_index = "slide_0" ,code_input = "print 3", code_output = "3", timestamp = '3').save
    RunTimeEvent.new("user_x", type="run", slide_index = "slide_0" ,code_input = "print 4", code_output = "4", timestamp = '4').save
    runtime_events = RunTimeEvent.find_last_user_execution_on_slide("user", "slide_0")
    assert_equal (["user", "run", "slide_0", "print 3", "3"]).inspect, runtime_events.inspect
  end
  
  def test06_should_find_last_send_for_the_right_slide
    RunTimeEvent.new("user", type="send", slide_index = "slide_0" ,code_input = "print 3", code_output = "3", timestamp = '3').save
    RunTimeEvent.new("user", type="send", slide_index = "slide_1" ,code_input = "print 4", code_output = "4", timestamp = '4').save
    runtime_events = RunTimeEvent.find_last_user_execution_on_slide("user", "slide_0")
    assert_equal (["user", "send", "slide_0", "print 3", "3"]).inspect, runtime_events.inspect
  end  

  def test07_should_find_last_send_for_the_right_user
    RunTimeEvent.new("user", type="send", slide_index = "slide_0" ,code_input = "print 3", code_output = "3", timestamp = '3').save
    RunTimeEvent.new("user_x", type="send", slide_index = "slide_0" ,code_input = "print 4", code_output = "4", timestamp = '4').save
    runtime_events = RunTimeEvent.find_last_user_execution_on_slide("user", "slide_0")
    assert_equal (["user", "send", "slide_0", "print 3", "3"]).inspect, runtime_events.inspect
  end 
  
  def teardown
    $db.execute_sql("delete from run_events")
  end
  
end

class TestRunTimeEvent_find_last_execution_in_teacher_slide < Test::Unit::TestCase 

  def setup
    $db.execute_sql("delete from run_events")
  end
  
  def test01_should_find_last_attendee_send
    RunTimeEvent.new("user", type="run", slide_index = "slide_0" ,code_input = "print 1", code_output = "1", timestamp = '1').save
    RunTimeEvent.new("user", type="run", slide_index = "slide_0" ,code_input = "print 2", code_output = "2", timestamp = '2').save
    RunTimeEvent.new("user", type="send", slide_index = "slide_0" ,code_input = "print 3", code_output = "3", timestamp = '3').save
    RunTimeEvent.new("0", type="run", slide_index = "slide_0" ,code_input = "print 5", code_output = "5", timestamp = '4').save    
    RunTimeEvent.new("user", type="send", slide_index = "slide_0" ,code_input = "print 4", code_output = "4", timestamp = '4').save
    runtime_events = RunTimeEvent.find_last_user_execution_on_slide("0", "slide_0")
    assert_equal (["user", "send", "slide_0", "print 4", "4"]).inspect, runtime_events.inspect
  end

  def test02_should_find_last_teacher_run
    RunTimeEvent.new("user", type="run", slide_index = "slide_0" ,code_input = "print 1", code_output = "1", timestamp = '1').save
    RunTimeEvent.new("user", type="run", slide_index = "slide_0" ,code_input = "print 2", code_output = "2", timestamp = '2').save
    RunTimeEvent.new("user", type="send", slide_index = "slide_0" ,code_input = "print 3", code_output = "3", timestamp = '3').save
    RunTimeEvent.new("user", type="send", slide_index = "slide_0" ,code_input = "print 4", code_output = "4", timestamp = '4').save
    RunTimeEvent.new("0", type="run", slide_index = "slide_0" ,code_input = "print 4", code_output = "4", timestamp = '5').save
    runtime_events = RunTimeEvent.find_last_user_execution_on_slide("0", "slide_0")
    assert_equal (["0", "run", "slide_0", "print 4", "4"]).inspect, runtime_events.inspect
  end
  
  def teardown
    $db.execute_sql("delete from run_events")
  end
  
end  