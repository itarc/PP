#encoding: utf-8

require 'rspec'
require 'capybara/rspec'

## -------------------------------------------------------
## SINATRA CONTROLLER (BEGIN)
## -------------------------------------------------------

require_relative '../../../controllers/slideshow.rb'
require_relative 'helper.rb'

Capybara.app = Sinatra::Application.new

set :public_folder, 'fixtures'
set :logging, false

teacher_presentation = '/teacher/presentation'
attendee_IDE = '/attendee/IDE'
attendee_IDE_with_code_to_display = '/attendee/IDE_with_code_to_display'

attendee_IDE_no_session = '/attendee/IDE_no_session'

get teacher_presentation do
  session[:user_id] = '0'
  redirect "teacher_presentation.html"
end

get attendee_IDE do
  session[:user_id] = '1'
  redirect "attendee_IDE.html"
end

get attendee_IDE_with_code_to_display do
  session[:user_id] = '1'
  redirect "attendee_IDE_with_code_to_display.html"
end

get attendee_IDE_no_session do
  redirect "attendee_IDE_with_code_to_display.html"
end

## -------------------------------------------------------
## SINATRA CONTROLLER (END)
## -------------------------------------------------------


def expect_sessionID_to_be_empty
  expect_sessionID_to_be('?')
end

def expect_login_page_to_be_empty
  expect_login_page_to_be('')
end

def expect_login_page_to_be(value)
  expect(page).to have_content 'AUTHOR NAME?'  
  expect(page).to have_field 'attendee_name', :with => value
end

def expect_sessionID_to_be(value)
  expect(page).to have_content 'AUTHOR: ' + value
end

describe 'Attendee IDE', :type => :feature, :js => true do
	
  before(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end	
  
  it 'should be empty when initialized' do

    visit attendee_IDE
    
    expect_IDE_to_be_empty
    
  end 
  
  it 'should display result when code is executed' do

    visit attendee_IDE
    
    fill_IDE_with('print "something"')
    
    execute
    
    expect_IDE_to_have(code_input = 'print "something"', code_output = 'something')
    
  end  

  it 'should display current code_helper' do

    visit teacher_presentation

    expect(page).to have_content 'EXERCISE - 1'
    
    visit attendee_IDE

    expect(page).to have_content 'HELPER 1'

    visit teacher_presentation
    
    go_right
    
    visit attendee_IDE

    press_space

    expect(page).to have_content 'HELPER 2'

    visit teacher_presentation

    go_left
    
    visit attendee_IDE

    press_space

    expect(page).to have_content 'HELPER 1'
    
  end
  
  after(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end   
  
end
  
describe 'Attendee Login', :type => :feature, :js => true do  
  
  before(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end	  

  it 'should create session ID with login page' do
    
    visit attendee_IDE
    
    expect_sessionID_to_be('?')
    
    expect_login_page_to_be_empty
    
    fill_in 'attendee_name', :with => "a name"
    expect(page).to have_field 'attendee_name', :with => 'a name'    
    
    find('#attendee_name').native.send_key(:return)

    expect(page).to have_field 'attendee_name', :with => ''
    
    expect_sessionID_to_be('a name')
    
    visit attendee_IDE_no_session

    expect_sessionID_to_be('a name')
    
  end
  
  it 'should clean login page after return pressed' do
    
    visit attendee_IDE
    
    expect_sessionID_to_be('?')
    
    expect_login_page_to_be_empty
    
    fill_in 'attendee_name', :with => "a name"
    
    expect_login_page_to_be("a name")
    
    find('#attendee_name').native.send_key(:return)

    expect_login_page_to_be_empty   
    
  end
  
  it 'should NOT create an empty session ID' do
    
    visit attendee_IDE
    
    expect_sessionID_to_be('?')
    
    expect_login_page_to_be_empty
    
    find('#attendee_name').native.send_key(:return)
    
    expect_sessionID_to_be('?')
    
  end  
  
  it 'should keep author name after a run' do
    
    visit attendee_IDE
    
    expect(page).to have_content 'HELPER 1'    
    
    fill_in 'attendee_name', :with => "a name"
    find('#attendee_name').native.send_key(:return)
    
    expect_sessionID_to_be('a name')        
    
    fill_IDE_with('print "something"')
    
    execute

    expect_sessionID_to_be('a name')  

  end
    
  it 'should keep author name after a slide change' do
    
    visit attendee_IDE
    
    fill_in 'attendee_name', :with => "a name"
    find('#attendee_name').native.send_key(:return)    
    
    $db.execute_sql("update teacher_current_slide set current_slide_id = '1'")    
    
    press_space
    
    expect(page).to have_content 'HELPER 2'    
    
    expect_sessionID_to_be('a name')

  end 

  it 'should display login if session ID is lost' do
    
    #~ visit attendee_IDE
    
    #~ fill_in 'attendee_name', :with => "a name"
    #~ find('#attendee_name').native.send_key(:return)    
    
    #~ $db.execute_sql("update teacher_current_slide set current_slide_id = '1'")    
    
    #~ press_space
    
    #~ expect(page).to have_content 'HELPER 2'    
    #~ expect_sessionID_to_be('a name')
    
    #~ visit attendee_IDE

    #~ expect(page).to have_content 'HELPER 1'    
    #~ expect_sessionID_to_be('?')

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

    visit attendee_IDE
    
    expect_IDE_to_be_empty
    
    fill_IDE_with("print 'code to run'")
    
    execute
    
    expect_IDE_to_have(code_input = "print 'code to run'", code_output = 'code to run')
    
    visit attendee_IDE
    
    expect_IDE_to_have(code_input = "print 'code to run'", code_output = 'code to run')
    
    press_space
    
    expect_IDE_to_have(code_input = "print 'code to run'", code_output = 'code to run')
    
  end

  it 'should show attendee last send' do   

    visit attendee_IDE
    
    expect_IDE_to_be_empty
    
    fill_IDE_with("print 'code to send'")
    
    send_code
    
    expect_IDE_to_have(code_input = "print 'code to send'", code_output = 'code to send')
    
    visit attendee_IDE
    
    expect_IDE_to_have(code_input = "print 'code to send'", code_output = 'code to send')
    
    press_space
    
    expect_IDE_to_have(code_input = "print 'code to send'", code_output = 'code to send')
    
  end
  
  it 'should show teacher last run' do 

    visit teacher_presentation
    go_down 
    
    expect_IDE_to_be_empty
    
    fill_IDE_with("print 'teacher run'")
    
    execute

    visit attendee_IDE
    
    expect_IDE_to_be_empty
    
    click_on 'get_code'
    
    expect_IDE_to_have(code_input = "print 'teacher run'", code_output = 'teacher run')
    
  end   
  
  it 'should show attendee last execution when slide moves' do   

    visit attendee_IDE
    
    expect_IDE_to_be_empty    
    
    fill_IDE_with("print 'code to run'")
    
    execute
    
    expect_IDE_to_have(code_input = "print 'code to run'", code_output = 'code to run')
    
  
    visit teacher_presentation
    
    go_right
    

    visit attendee_IDE
    
    expect_IDE_to_be_empty    
    
    fill_IDE_with("print 'code to send'")    
    
    send_code  

    expect_IDE_to_have(code_input = "print 'code to send'", code_output = 'code to send')
    

    visit teacher_presentation
    
    go_left
    
    visit attendee_IDE
    
    expect_IDE_to_have(code_input = "print 'code to run'", code_output = 'code to run')
    
    
    visit teacher_presentation
    
    go_right
    
    
    visit attendee_IDE    
    
    expect_IDE_to_have(code_input = "print 'code to send'", code_output = 'code to send')
    
  end

  after(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end
  
end

describe 'Attendee IDE with code to display', :type => :feature, :js => true do
	
  before(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")        
  end	

  it 'should run code to display' do

    visit attendee_IDE_with_code_to_display
    
    expect(page).to have_content "HELPER 1"
    expect(page).to have_no_content "print 'DISPLAYED CODE'"

    expect_IDE_to_have(code_input = "print 'DISPLAYED CODE'", code_output = "DISPLAYED CODE")

  end  
  
  it 'should run code to add without displaying it' do
	  
    visit teacher_presentation

    go_right
       
    visit attendee_IDE_with_code_to_display
    
    press_space
    
    expect(page).to have_content "HELPER 2"
    expect(page).to have_content "print 'ADDED CODE'"   
    
    expect_IDE_to_have(code_input = "", code_output = "ADDED CODE")    

  end  
  
  it 'should run last attendee code (not teacher code)' do
	  
    visit teacher_presentation

    go_down
     
    fill_IDE_with("puts 'TEACHER CODE'" )
   
    execute
       
    visit attendee_IDE_with_code_to_display
    
    expect_IDE_to_have(code_input = "print 'DISPLAYED CODE'", code_output = "DISPLAYED CODE")    

  end    
  
  after(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")        
  end    

end
