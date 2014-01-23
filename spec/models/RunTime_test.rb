require_relative '../../models/RunTime'
require 'test/unit'

class TestRunTime_eval_ruby < Test::Unit::TestCase

  def test01_should_be_empty_when_no_code
    assert_equal "", eval_ruby("")
  end
  
  def test02_should_evaluate_expression
    assert_equal "1", eval_ruby("1")
  end

  def test03_should_evaluate_another_expression
    assert_equal "2", eval_ruby("1 + 1")
  end
  
  def test04_should_evaluate_an_instruction
    assert_equal "3", eval_ruby("print 3")
  end
  
  def test05_should_evaluate_another_instruction
    assert_equal "4\n", eval_ruby("puts 4")
  end
  
  def test06_should_return_error_message
    assert eval_ruby("puts a").include?("undefined local variable or method `a'")
  end

end

class TestRunTime_run_ruby < Test::Unit::TestCase
  
  def test01_should_be_empty_when_no_code
    assert_equal "", run_ruby("")
  end
  
  def test02_should_run_an_instruction
    assert_equal "3", run_ruby("print 3")
  end
  
  def test05_should_run_another_instruction
    assert_equal "4\n", run_ruby("puts 4")
  end
  
  def test06_should_return_error_message
    assert run_ruby("puts a").include?("undefined local variable or method `a'")
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
    assert run_ruby(tests).include?("1 tests, 1 assertions, 0 failures, 0 errors, 0 skips")
  end  

end

class TestRunTimeEvent < Test::Unit::TestCase
  
  def setup
    $db.execute_sql("delete from run_events")
  end
  
  def test01_initialization
    runtime_event = RunTimeEvent.new("user", code_input = "print 1", code_output = "1")
    assert_equal  "user", runtime_event.user
    assert_equal  "print 1", runtime_event.code_input
    assert_equal  "1", runtime_event.code_output
    assert_equal (["user", "print 1", "1"]).inspect, runtime_event.to_s
  end
  
  def test02_should_find_a_runtime_event_for_a_user
    RunTimeEvent.new("user", code_input = "print 2", code_output = "2").save
    runtime_events = RunTimeEvent.find("user")
    assert_equal 1, runtime_events.size
    assert_equal ([["user", "print 2", "2"]]).inspect, runtime_events.inspect
  end
  
  def test03_should_find_a_runtime_event_for_a_user
    RunTimeEvent.new("user_1", code_input = "print 1", code_output = "1").save
    RunTimeEvent.new("user_2", code_input = "print 2", code_output = "2").save
    runtime_events = RunTimeEvent.find("user_1")
    assert_equal 1, runtime_events.size
    assert_equal ([["user_1", "print 1", "1"]]).inspect, runtime_events.inspect
  end  
  
  def test04_should_find_all_runtime_events
    RunTimeEvent.new("user", code_input = "print 3", code_output = "3").save
    runtime_events = RunTimeEvent.find_all
    assert_equal 1, runtime_events.size
    assert_equal ([["user", "print 3", "3"]]).inspect, runtime_events.inspect
  end

  def teardown
    $db.execute_sql("delete from run_events")
  end

end
