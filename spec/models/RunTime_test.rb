#encoding: utf-8

require_relative '../../models/RunTime'
require 'test/unit'

class TestRunTime_run_ruby < Test::Unit::TestCase
  
  def test01_should_be_empty_when_no_code
    assert_equal "", run_ruby(nil, "", nil, nil)
  end
  
  def test02_should_run_an_instruction
    assert_equal "3", run_ruby(nil, "print 3", nil, nil)
  end
  
  def test05_should_run_another_instruction
    assert_equal "4\n", run_ruby(nil, "puts 4", nil, nil)
  end
  
  def test06_should_return_error_message
    assert run_ruby(nil, "puts a", nil, nil).include?("undefined local variable or method `a'")
  end
  
  def test07_should_run_unit_tests
    tests = %Q{
          def method_to_test
            true
          end
          require 'test/unit'
          class TestMethod < Test::Unit::TestCase
            def test01
            assert_equal true, method_to_test
            end
          end
  }
    assert run_ruby(nil, tests, nil, nil).include?("1 tests, 1 assertions, 0 failures, 0 errors, 0 skips")
  end
  
  def test08_should_save_run_event
    $db.execute_sql("delete from run_events")
    run_ruby("run", "print 7", "user", "slide_index")
    assert_equal (['user', 'run', 'slide_index', 'print 7', '7']).inspect, RunTimeEvent.find_all[0].inspect
    $db.execute_sql("delete from run_events")
  end

  def test09_should_save_send_event
    $db.execute_sql("delete from run_events")
    run_ruby("send", "print 8", "user", "slide_index")
    assert_equal (['user', 'send', 'slide_index', 'print 8', '8']).inspect, RunTimeEvent.find_all[0].inspect
    $db.execute_sql("delete from run_events")
  end
  
  def test10_should_accept_encoding
    assert_equal "éèêàâùï\n", run_ruby(nil, "#encoding: utf-8\nputs 'éèêàâùï'", nil, nil)
  end   

end

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

  def test03_should_find_empty_list_when_no_runtime_events
    assert_equal [], RunTimeEvent.find_all
  end
  
  def test04_should_find_a_runtime_event
    RunTimeEvent.new("user", type="run", slide_index = "slide_0" ,code_input = "print 3", code_output = "3", timestamp = 'timestamp').save
    runtime_events = RunTimeEvent.find_all
    assert_equal 1, runtime_events.size
    assert_equal ([["user", "run", "slide_0", "print 3", "3"]]).inspect, runtime_events.inspect
    assert_equal "timestamp", runtime_events[0].timestamp
  end  

  def test05_should_find_a_runtime_event_in_order
    RunTimeEvent.new("user_2", type="run", slide_index = "slide_0" ,code_input = "print 5", code_output = "5", timestamp = 'timestamp').save
    RunTimeEvent.new("user_1", type="run", slide_index = "slide_0" ,code_input = "print 4", code_output = "4", timestamp = 'timestamp').save
    runtime_events = RunTimeEvent.find_all
    assert_equal 2, runtime_events.size
    assert_equal ([["user_2", "run", "slide_0", "print 5", "5"], ["user_1", "run", "slide_0", "print 4", "4"]]).inspect, runtime_events.inspect
    assert_equal "timestamp", runtime_events[0].timestamp
  end
  
  def test06_should_find_a_runtime_event_for_a_user
    RunTimeEvent.new("user", type="run", slide_index = "slide_0" ,code_input = "print 2", code_output = "2").save
    runtime_events = RunTimeEvent.find("user")
    assert_equal 1, runtime_events.size
    assert_equal ([["user", "run","slide_0", "print 2", "2"]]).inspect, runtime_events.inspect
  end
  
  def test07_should_find_the_runtime_event_for_a_user
    RunTimeEvent.new("user_1", type="run", slide_index = "slide_0" ,code_input = "print 1", code_output = "1").save
    RunTimeEvent.new("user_2", type="run", slide_index = "slide_0" ,code_input = "print 2", code_output = "2").save
    runtime_events = RunTimeEvent.find("user_1")
    assert_equal 1, runtime_events.size
    assert_equal ([["user_1", "run", "slide_0", "print 1", "1"]]).inspect, runtime_events.inspect
  end 

  def test08_should_find_the_last_runtime_event_for_a_slide_index
    RunTimeEvent.new("user_1", type="run", slide_index = "slide_index_1" ,code_input = "print 1", code_output = "1").save
    RunTimeEvent.new("user_1", type="run", slide_index = "slide_index_1" ,code_input = "print 2", code_output = "2").save
    runtime_events = RunTimeEvent.find_last("slide_index_1")
    assert_equal (["user_1", "run", "slide_index_1", "print 2", "2"]).inspect, runtime_events.inspect
    runtime_events = RunTimeEvent.find_last("slide_index_1", 0)
    assert_equal (["user_1", "run", "slide_index_1", "print 2", "2"]).inspect, runtime_events.inspect
    runtime_events = RunTimeEvent.find_last("slide_index_1", nil)
    assert_equal (["user_1", "run", "slide_index_1", "print 2", "2"]).inspect, runtime_events.inspect    
  end 

  def test09_should_find_the_last_runtime_event_for_a_slide_index_and_a_user
    RunTimeEvent.new("user_1", type="run", slide_index = "slide_index_1" ,code_input = "print A", code_output = "A").save
    RunTimeEvent.new("user_1", type="run", slide_index = "slide_index_1" ,code_input = "print B", code_output = "B").save
    RunTimeEvent.new("user_2", type="run", slide_index = "slide_index_1" ,code_input = "print C", code_output = "C").save
    runtime_events = RunTimeEvent.find_last("slide_index_1", "user_1")
    assert_equal (["user_1", "run", "slide_index_1", "print B", "B"]).inspect, runtime_events.inspect
  end
  
  def test10_should_find_the_last_runtime_event_sent_for_a_slide_index
    RunTimeEvent.new("user_1", type="send", slide_index = "slide_index_1" ,code_input = "print 1", code_output = "1").save
    RunTimeEvent.new("user_1", type="send", slide_index = "slide_index_1" ,code_input = "print 2", code_output = "2").save
    runtime_events = RunTimeEvent.find_last_send("slide_index_1")
    assert_equal (["user_1", "send", "slide_index_1", "print 2", "2"]).inspect, runtime_events.inspect
    runtime_events = RunTimeEvent.find_last_send("slide_index_1", 0)
    assert_equal (["user_1", "send", "slide_index_1", "print 2", "2"]).inspect, runtime_events.inspect
    runtime_events = RunTimeEvent.find_last_send("slide_index_1", nil)
    assert_equal (["user_1", "send", "slide_index_1", "print 2", "2"]).inspect, runtime_events.inspect    
  end 

  def test11_should_find_the_last_runtime_event_sent_for_a_slide_index_and_a_user
    RunTimeEvent.new("user_1", type="send", slide_index = "slide_index_1" ,code_input = "print A", code_output = "A").save
    RunTimeEvent.new("user_1", type="send", slide_index = "slide_index_1" ,code_input = "print B", code_output = "B").save
    RunTimeEvent.new("user_2", type="send", slide_index = "slide_index_1" ,code_input = "print C", code_output = "C").save
    runtime_events = RunTimeEvent.find_last_send("slide_index_1", "user_1")
    assert_equal (["user_1", "send", "slide_index_1", "print B", "B"]).inspect, runtime_events.inspect
  end 
  
  def test12_should_find_the_last_runtime_event_sent_for_a_slide_index_and_a_user_even_if_last_run_exists
    RunTimeEvent.new("user_1", type="send", slide_index = "slide_index_1" ,code_input = "print A", code_output = "A").save
    RunTimeEvent.new("user_1", type="run", slide_index = "slide_index_1" ,code_input = "print B", code_output = "B").save
    RunTimeEvent.new("user_2", type="run", slide_index = "slide_index_1" ,code_input = "print C", code_output = "C").save
    runtime_events = RunTimeEvent.find_last_send("slide_index_1", "user_1")
    assert_equal (["user_1", "send", "slide_index_1", "print A", "A"]).inspect, runtime_events.inspect
  end  

  def test13_should_find_the_last_runtime_event_for_a_slide_index_and_a_user_even_if_last_send_exists
    RunTimeEvent.new("user_1", type="run", slide_index = "slide_index_1" ,code_input = "print A", code_output = "A").save
    RunTimeEvent.new("user_1", type="send", slide_index = "slide_index_1" ,code_input = "print B", code_output = "B").save
    RunTimeEvent.new("user_2", type="run", slide_index = "slide_index_1" ,code_input = "print C", code_output = "C").save
    runtime_events = RunTimeEvent.find_last("slide_index_1", "user_1")
    assert_equal (["user_1", "run", "slide_index_1", "print A", "A"]).inspect, runtime_events.inspect
  end 
  
  def test10_should_not_raise_an_error_when_quotes_in_strings
    assert_nothing_raised { RunTimeEvent.new("user_1", type="run", slide_index = "slide_0" ,code_input = "'string in simple quotes 1'", code_output = "").save }
  end  

  def teardown
    $db.execute_sql("delete from run_events")
  end

end
