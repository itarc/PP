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
  
  def test10_should_raise_an_exception_when_encoding_is_needed
    assert run_ruby(nil, "puts 'éèêàâùï'", nil, nil).include?("invalid multibyte char (US-ASCII)"), run_ruby(nil, "puts 'éèêàâùï'", nil, nil)
  end   
  
  def test11_should_accept_encoding
    assert_equal "éèêàâùï\n", run_ruby(nil, "#encoding: utf-8\nputs 'éèêàâùï'", nil, nil)
  end   

end