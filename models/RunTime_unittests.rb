require_relative 'RunTime'
require 'test/unit'

class TestRunTime_run_ruby < Test::Unit::TestCase
  
  def test01_should_be_empty_when_no_code
    assert_equal "", run_ruby("")
  end
  
  def test02_should_evaluate_expression
    assert_equal "1", run_ruby("1")
  end

  def test03_should_evaluate_another_expression
    assert_equal "2", run_ruby("1 + 1")
  end
  
  def test04_should_evaluate_an_instruction
    assert_equal "3", run_ruby("print 3")
  end
  
  def test05_should_evaluate_another_instruction
    assert_equal "4\n", run_ruby("puts 4")
  end
  
  def test06_should_return_error_message
    assert run_ruby("puts a").include?("undefined local variable or method `a'")
  end

end