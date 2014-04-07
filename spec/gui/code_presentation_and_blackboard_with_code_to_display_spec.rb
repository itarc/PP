#encoding: utf-8

require 'rspec'
require 'capybara/rspec'

## -------------------------------------------------------
## SINATRA CONTROLLER (BEGIN)
## -------------------------------------------------------

require_relative '../../controllers/slideshow.rb'

Capybara.app = Sinatra::Application.new

set :public_folder, 'fixtures'
set :logging, false

teacher_coding_presentation = '/teacher/coding_presentation'
blackboard_with_code_to_display = '/attendee/blackboard_with_code_to_display'

get teacher_coding_presentation do
  session[:user_id] = '0'	
  redirect "coding_presentation-teacher.html"
end

get blackboard_with_code_to_display do  
  redirect "coding_presentation_with_code_to_display-blackboard.html"
end

## -------------------------------------------------------
## SINATRA CONTROLLER (END)
## -------------------------------------------------------

## -------------------------------------------------------
## HELPERS (BEGIN)
## -------------------------------------------------------

def press_space
  find(:css, 'div.presentation').native.send_key(:space)
end

def go_right
  find(:css, 'div.presentation').native.send_key(:arrow_right)
end

def go_left
  find(:css, 'div.presentation').native.send_key(:arrow_left)
end

def go_down
  find(:css, 'div.presentation').native.send_key(:arrow_down)
end

def go_up
  find(:css, 'div.presentation').native.send_key(:arrow_up)
end

def execute
  click_on "execute"
end

def send_code
  click_on "send_code"
end

def fill_IDE_with(code_input)
  fill_in 'code_input', :with => code_input
end

def expect_IDE_to_have(code_input, code_output)
  expect(page).to have_field 'code_input', :with => code_input
  expect(page).to have_field 'code_output', :with => code_output
end

def expect_IDE_to_be_empty
  expect_IDE_to_have(code_input = '', code_output = '')
end

## -------------------------------------------------------
## HELPERS (END)
## -------------------------------------------------------
  
describe 'Blackboard Navigation with code to display', :type => :feature, :js => true do  
	
  before(:all) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide") 
  end

  it 'should always show last teacher run if present' do
    
    visit teacher_coding_presentation
    go_down
    
    visit blackboard_with_code_to_display
    
    expect_IDE_to_have(code_input = "print 'code to display'", code_output = "code to display")   
    
    visit teacher_coding_presentation
    go_down

    fill_IDE_with("print 'teacher run'")
    
    execute

    expect_IDE_to_have(code_input = "print 'teacher run'", code_output = "teacher run") 
    
    visit blackboard_with_code_to_display
    
    expect_IDE_to_have(code_input = "print 'teacher run'", code_output = "teacher run")   
    
    press_space

    expect_IDE_to_have(code_input = "print 'teacher run'", code_output = "teacher run")   

  end

  after(:all) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end   

end  