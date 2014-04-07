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
attendee_coding_presentation = '/attendee/coding_slide_with_NO_code_to_display'
blackboard = '/attendee/blackboard'

get teacher_coding_presentation do
  session[:user_id] = '0'	
  redirect "coding_presentation-teacher.html"
end

get attendee_coding_presentation do
  session[:user_id] = '1'
  redirect "coding_slide_with_NO_code_to_display-attendee.html"
end

get blackboard do  
  redirect "coding_presentation-blackboard.html"
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
  
describe 'Blackboard Navigation', :type => :feature, :js => true do  
	
  before(:all) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide") 
  end

  it 'should be on first slide' do

    visit teacher_coding_presentation
    
    expect(page).to have_content 'CODING EXERCISE - 1'
  
    visit blackboard
        
    expect(page).to have_content 'CODING EXERCISE - 1'   

  end
  
  it 'should be on second slide' do
    
    visit teacher_coding_presentation
    
    go_right
    
    expect(page).to have_content 'CODING EXERCISE - 2'
  
    visit blackboard
        
    expect(page).to have_content 'CODING EXERCISE - 2'  

  end

  it 'should be on IDE with code helper 2' do
    
    visit teacher_coding_presentation
    
    go_down    
    
    expect(page).to have_content 'HELPER 2'
  
    visit blackboard
        
    expect(page).to have_content 'HELPER 2'       

  end
  
  it 'should be on IDE with code helper 1' do
    
    visit teacher_coding_presentation
    
    go_left
    
    expect(page).to have_content 'HELPER 1'
  
    visit blackboard
        
    expect(page).to have_content 'HELPER 1'       

  end  

  it 'should be back on first slide' do
    
    visit teacher_coding_presentation
    
    go_up
    
    expect(page).to have_content 'CODING EXERCISE - 1'
  
    visit blackboard
        
    expect(page).to have_content 'CODING EXERCISE - 1'       

  end
  
  after(:all) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end   

end

describe 'Blackboard Refresh', :type => :feature, :js => true do  
	
  before(:all) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide") 
  end

  it 'should always get last teacher run' do
    
    visit teacher_coding_presentation
    go_down
    
    visit attendee_coding_presentation
    
    expect_IDE_to_be_empty
    
    fill_IDE_with("print 'attendee run'")
    
    click_on "execute"
    
    expect_IDE_to_have(code_input = "print 'attendee run'", code_output = "attendee run")    
    
    visit blackboard
    
    expect_IDE_to_be_empty   

    visit attendee_coding_presentation
    
    fill_IDE_with("print 'attendee send'")
    
    click_on "send_code"
    
    expect_IDE_to_have(code_input = "print 'attendee send'", code_output = "attendee send")   

    visit blackboard
    
    expect_IDE_to_be_empty 
    
    visit teacher_coding_presentation
    go_down

    press_space
    
    expect_IDE_to_have(code_input = "print 'attendee send'", code_output = "attendee send") 

    visit blackboard

    expect_IDE_to_have(code_input = "print 'attendee send'", code_output = "attendee send")

    visit teacher_coding_presentation
    go_down
    
    fill_IDE_with("print 'teacher run'")
    
    click_on "execute"
    
    visit blackboard

    expect_IDE_to_have(code_input = "print 'teacher run'", code_output = "teacher run")    
    
    run_ruby "run", "print 'teacher run 2'", "0", "0"
    
    press_space
  
    expect_IDE_to_have(code_input = "print 'teacher run 2'", code_output = "teacher run 2")   
    

  end
  
  
  after(:all) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end   

end  