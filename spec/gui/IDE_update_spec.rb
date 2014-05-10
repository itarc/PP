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
attendee_coding_slide_with_ALT_R_and_ALT_S_and_ALT_G = '/attendee/coding_slide_with_NO_code_to_display'

get teacher_coding_presentation do
  session[:user_id] = '0'		
  redirect "coding_presentation-teacher.html"
end

get attendee_coding_slide_with_ALT_R_and_ALT_S_and_ALT_G do
  session[:user_id] = '1'
  redirect "coding_slide_with_NO_code_to_display-attendee.html"
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

def expect_IDE_to_have(code_input, code_output, author = nil)
  expect(page).to have_field 'code_input', :with => code_input
  expect(page).to have_field 'code_output', :with => code_output
  within "#author_name" do
    expect(page.text).to eq author if author != nil
  end
end

def expect_IDE_to_be_empty
  expect_IDE_to_have(code_input = '', code_output = '', author = nil)
end

## -------------------------------------------------------
## HELPERS (END)
## -------------------------------------------------------

describe 'Teacher IDE update', :type => :feature, :js => true do

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
  
  it 'should show attendee last send with author name' do   

    visit teacher_coding_presentation
    go_down 
    
    expect_IDE_to_be_empty
    
    run_ruby "send", 'print "attendee send"', "attendee 1", "0"
    
    press_space
    
    expect_IDE_to_have(code_input = 'print "attendee send"', code_output = 'attendee send', author = 'attendee 1')
    
  end
  
  it 'should NOT show attendee last send if not on right slide' do   

    visit teacher_coding_presentation
    go_down   
    
    expect_IDE_to_be_empty
    
    run_ruby "send", 'print "attendee send"', "attendee 1", "0"
    
    go_right
    press_space
    
    expect_IDE_to_be_empty

  end  
  
  it 'should always show teacher last run if it happened after last send' do   

    visit teacher_coding_presentation
    go_down 
    
    expect_IDE_to_be_empty
    
    run_ruby "send", 'print "attendee send"', "attendee 1", "0"
    
    press_space
    
    expect_IDE_to_have(code_input = 'print "attendee send"', code_output = 'attendee send', author = 'attendee 1')
    
    fill_IDE_with('print "new code to run"')
    
    execute
    
    expect_IDE_to_have(code_input = 'print "new code to run"', code_output = 'new code to run', author = '0')    
    
    press_space
    
    expect_IDE_to_have(code_input = 'print "new code to run"', code_output = 'new code to run', author = '0')
    
  end  

  it 'should NOT show last run if not on the current slide' do
    
    visit teacher_coding_presentation
    go_down
    
    expect_IDE_to_be_empty    
    
    fill_IDE_with("print 'code to run'")
    
    execute
    
    expect_IDE_to_have(code_input = "print 'code to run'", code_output = 'code to run', author = '0')
    
    go_right
    
    visit teacher_coding_presentation
    go_down    
    
    expect_IDE_to_be_empty

  end  
  
  it 'should keep last atendee send when navigating right' do   

    visit teacher_coding_presentation
    go_down
    
    expect_IDE_to_be_empty
    
    run_ruby "send", 'print "attendee send"', "attendee 1", "0"
    
    go_right
    
    expect_IDE_to_be_empty   
    
    go_left
    
    expect_IDE_to_have(code_input = 'print "attendee send"', code_output = 'attendee send', author = 'attendee 1')
    
    go_right

    expect_IDE_to_have(code_input = 'print "attendee send"', code_output = 'attendee send', author = 'attendee 1')   
    
  end    
  
  after(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end    
	
end

describe 'Attendee IDE update', :type => :feature, :js => true do

  before(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end
  
  it 'should show attendee last run' do   

    visit attendee_coding_slide_with_ALT_R_and_ALT_S_and_ALT_G
    
    expect_IDE_to_be_empty
    
    fill_IDE_with("print 'code to run'")
    
    execute
    
    expect_IDE_to_have(code_input = "print 'code to run'", code_output = 'code to run')
    
    visit attendee_coding_slide_with_ALT_R_and_ALT_S_and_ALT_G
    
    expect_IDE_to_have(code_input = "print 'code to run'", code_output = 'code to run')
    
    press_space
    
    expect_IDE_to_have(code_input = "print 'code to run'", code_output = 'code to run')
    
  end

  it 'should show attendee last send' do   

    visit attendee_coding_slide_with_ALT_R_and_ALT_S_and_ALT_G
    
    expect_IDE_to_be_empty
    
    fill_IDE_with("print 'code to send'")
    
    send_code
    
    expect_IDE_to_have(code_input = "print 'code to send'", code_output = 'code to send')
    
    visit attendee_coding_slide_with_ALT_R_and_ALT_S_and_ALT_G
    
    expect_IDE_to_have(code_input = "print 'code to send'", code_output = 'code to send')
    
    press_space
    
    expect_IDE_to_have(code_input = "print 'code to send'", code_output = 'code to send')
    
  end
  
  it 'should show teacher last run' do 

    visit teacher_coding_presentation
    go_down 
    
    expect_IDE_to_be_empty
    
    fill_IDE_with("print 'teacher run'")
    
    execute

    visit attendee_coding_slide_with_ALT_R_and_ALT_S_and_ALT_G
    
    expect_IDE_to_be_empty
    
    click_on 'get_code'
    
    expect_IDE_to_have(code_input = "print 'teacher run'", code_output = 'teacher run')
    
  end   
  
  it 'should show attendee last execution when slide moves' do   

    visit attendee_coding_slide_with_ALT_R_and_ALT_S_and_ALT_G
    
    expect_IDE_to_be_empty    
    
    fill_IDE_with("print 'code to run'")
    
    execute
    
    expect_IDE_to_have(code_input = "print 'code to run'", code_output = 'code to run')
    
  
    visit teacher_coding_presentation
    
    go_right
    

    visit attendee_coding_slide_with_ALT_R_and_ALT_S_and_ALT_G
    
    expect_IDE_to_be_empty    
    
    fill_IDE_with("print 'code to send'")    
    
    send_code  

    expect_IDE_to_have(code_input = "print 'code to send'", code_output = 'code to send')
    

    visit teacher_coding_presentation
    
    go_left
    
    visit attendee_coding_slide_with_ALT_R_and_ALT_S_and_ALT_G
    
    expect_IDE_to_have(code_input = "print 'code to run'", code_output = 'code to run')
    
    
    visit teacher_coding_presentation
    
    go_right
    
    
    visit attendee_coding_slide_with_ALT_R_and_ALT_S_and_ALT_G    
    
    expect_IDE_to_have(code_input = "print 'code to send'", code_output = 'code to send')
    
  end

  after(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end
  
end