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
attendee_coding_slide_with_ALT_R_and_ALT_S = '/attendee/coding_slide_with_NO_code_to_display'

get teacher_coding_presentation do	
  redirect "coding_presentation-teacher.html"
end

get attendee_coding_slide_with_ALT_R_and_ALT_S do
  redirect "coding_slide_with_NO_code_to_display-attendee.html"
end

## -------------------------------------------------------
## SINATRA CONTROLLER (END)
## -------------------------------------------------------

## -------------------------------------------------------
## HELPERS (BEGIN)
## -------------------------------------------------------

def go_down
  find(:css, 'div.presentation').native.send_key(:arrow_down)
end

def press_space
  find(:css, 'div.presentation').native.send_key(:space)
end

def go_right
  find(:css, 'div.presentation').native.send_key(:arrow_right)
end

def go_left
  find(:css, 'div.presentation').native.send_key(:arrow_left)
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

describe 'SYNCHRO of teacher IDE Slide', :type => :feature, :js => true do

  before(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end
  
  it 'should NOT show attendee last run' do   

    visit teacher_coding_presentation
    go_down
    
    expect_IDE_to_be_empty
    
    run_ruby "run", 'print "attendee run"', "attendee 1", "0"
    
    press_space
    
    expect_IDE_to_be_empty
    
  end 
  
  it 'should show attendee last send of current slide' do   

    visit teacher_coding_presentation
    go_down 
    
    expect_IDE_to_be_empty
    
    run_ruby "send", 'print "attendee send"', "attendee 1", "0"
    
    press_space
    
    expect_IDE_to_have(code_input = 'print "attendee send"', code_output = 'attendee send')
    
  end
  
  it 'should ONLY show CURRENT SLIDE attendee last send' do   

    visit teacher_coding_presentation
    go_down   
    
    expect_IDE_to_be_empty
    
    run_ruby "send", 'print "attendee send"', "attendee 1", "0"
    
    go_right
    press_space
    
    expect_IDE_to_be_empty

  end
  
  after(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end    
	
end

describe 'NAVIGATION in teacher IDE slide', :type => :feature, :js => true do

  before(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end

  it 'should keep last send when navigating right' do   

    visit teacher_coding_presentation
    go_down
    
    expect_IDE_to_be_empty
    
    run_ruby "send", 'print "attendee send"', "attendee 1", "0"
    
    go_right
    
    expect_IDE_to_be_empty   
    
    go_left
    
    expect_IDE_to_have(code_input = 'print "attendee send"', code_output = 'attendee send')
    
    go_right

    expect_IDE_to_have(code_input = 'print "attendee send"', code_output = 'attendee send')   
    
  end  
  
  after(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end    

end