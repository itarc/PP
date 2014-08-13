require_relative '../../models/RunTime'
require 'test/unit'

# To Keep if want to avoid users to execute system commands

class TestRunTime_do_not_run_system_commands < Test::Unit::TestCase
  
  #~ def test01_should_not_run_exec_command
    #~ assert run_ruby(nil, "exec('pwd')", nil, nil).include?("undefined method `exec' for main:Object (NoMethodError)")
  #~ end
  
  #~ def test02_should_not_run_system_command
    #~ assert run_ruby(nil, "system('pwd')", nil, nil).include?("undefined method `system' for main:Object (NoMethodError)")
  #~ end  

  #~ def test03_should_not_run_percent_x_command
    #~ assert run_ruby(nil, "%x('pwd')", nil, nil).include?("undefined method ``' for main:Object (NoMethodError)")
  #~ end 
  
  #~ def test03_should_not_run_backticks_command
    #~ assert run_ruby(nil, "`pwd`", nil, nil).include?("undefined method ``' for main:Object (NoMethodError)")
  #~ end   
  
end
