require_relative '../../models/RunTime'
require 'test/unit'

class TestRunTime_insert_method_undef < Test::Unit::TestCase
  
  def setup
    @method_undef = "undef :exec\nundef :system\nundef :`\n"
  end

  def test01_insert_method_undef_if_empty
    assert_equal @method_undef , insert_method_undef("")
  end
  
  def test02_insert_method_undef
    assert_equal @method_undef + "original_code", insert_method_undef("original_code")
  end
  
  def test03_insert_method_undef_after_encoding
    assert_equal "#encoding xxx\n"+@method_undef+"original_code", insert_method_undef("#encoding xxx\noriginal_code")
  end

  def test04_insert_method_undef_after_encoding_different_encoding
    assert_equal "#encoding yyy\n"+@method_undef+"original_code", insert_method_undef("#encoding yyy\noriginal_code")
  end
  
  def test05_insert_method_undef_after_encoding_with_multiline_code
    assert_equal "#encoding xxx\n"+@method_undef+"original_code_line_1\noriginal_code_line_2\n", insert_method_undef("#encoding xxx\noriginal_code_line_1\noriginal_code_line_2\n")
  end  

  def test06_insert_method_undef_after_encoding_with_space_before
    assert_equal " #encoding xxx\n"+@method_undef+"original_code", insert_method_undef(" #encoding xxx\noriginal_code")
    assert_equal "  #encoding xxx\n"+@method_undef+"original_code", insert_method_undef("  #encoding xxx\noriginal_code")
  end
  
end

class TestRunTime_do_not_run_system_commands < Test::Unit::TestCase
  
  def test01_should_not_run_exec_command
    assert run_ruby(nil, "exec('pwd')", nil, nil).include?("undefined method `exec' for main:Object (NoMethodError)")
  end
  
  def test02_should_not_run_system_command
    assert run_ruby(nil, "system('pwd')", nil, nil).include?("undefined method `system' for main:Object (NoMethodError)")
  end  

  def test03_should_not_run_percent_x_command
    assert run_ruby(nil, "%x('pwd')", nil, nil).include?("undefined method ``' for main:Object (NoMethodError)")
  end 
  
  def test03_should_not_run_backticks_command
    assert run_ruby(nil, "`pwd`", nil, nil).include?("undefined method ``' for main:Object (NoMethodError)")
  end   
  
end
