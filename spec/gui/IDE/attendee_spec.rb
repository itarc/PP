#encoding: utf-8

require 'rspec'
require 'capybara/rspec'

## -------------------------------------------------------
## SINATRA CONTROLLER (BEGIN)
## -------------------------------------------------------

require_relative '../../../controllers/slideshow.rb'
require_relative 'IDE_spec_helper.rb'

Capybara.app = Sinatra::Application.new

set :public_folder, 'fixtures'
set :logging, false

teacher_coding_presentation = '/teacher/coding_presentation'
attendee_IDE_with_NO_code_to_display = '/attendee/coding_slide_with_NO_code_to_display'
attendee_IDE_with_NO_code_to_display_no_session = '/attendee/coding_slide_with_NO_code_to_display_no_session'
attendee_IDE_with_code_to_display = '/attendee/coding_slide_with_code_to_display'
attendee_coding_slide_with_ALT_R_and_ALT_S_and_ALT_G = '/attendee/coding_slide_with_NO_code_to_display'

get teacher_coding_presentation do
  session[:user_id] = '0'
  redirect "coding_presentation-teacher.html"
end

get attendee_IDE_with_NO_code_to_display do
  session[:user_id] = '1'
  redirect "coding_slide_with_NO_code_to_display-attendee.html"
end

get attendee_IDE_with_code_to_display do
  session[:user_id] = '1'
  redirect "coding_slide_with_code_to_display-attendee.html"
end

get attendee_IDE_with_NO_code_to_display_no_session do
  redirect "coding_slide_with_code_to_display-attendee.html"
end

get attendee_coding_slide_with_ALT_R_and_ALT_S_and_ALT_G do
  session[:user_id] = '1'
  redirect "coding_slide_with_NO_code_to_display-attendee.html"
end

## -------------------------------------------------------
## SINATRA CONTROLLER (END)
## -------------------------------------------------------

describe 'Attendee IDE', :type => :feature, :js => true do
	
  before(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end	
  
  it 'should be empty when initialized' do

    visit attendee_IDE_with_NO_code_to_display
    
    expect_IDE_to_be_empty
    
  end 
  
  it 'should display result when code is executed' do

    visit attendee_IDE_with_NO_code_to_display
    
    fill_IDE_with('print "something"')
    
    execute
    
    expect_IDE_to_have(code_input = 'print "something"', code_output = 'something')
    
  end  

  it 'should display current code_helper' do

    visit teacher_coding_presentation

    expect(page).to have_content 'EXERCISE - 1'
    
    visit attendee_IDE_with_NO_code_to_display

    expect(page).to have_content 'HELPER 1'

    visit teacher_coding_presentation
    
    go_right
    
    visit attendee_IDE_with_NO_code_to_display

    press_space

    expect(page).to have_content 'HELPER 2'

    visit teacher_coding_presentation

    go_left
    
    visit attendee_IDE_with_NO_code_to_display

    press_space

    expect(page).to have_content 'HELPER 1'
    
  end

  it 'should ask an author name' do
    
    visit attendee_IDE_with_NO_code_to_display
    
    expect(page).to have_content 'AUTHOR: #'

    expect(page).to have_field 'attendee_name', :with => ''

    expect(page).to have_content 'AUTHOR NAME?'
    
    find('#attendee_name').native.send_key(:return)

    expect(page).to have_content 'AUTHOR: #'
    
    fill_in 'attendee_name', :with => "a name"
    
    expect(page).to have_field 'attendee_name', :with => 'a name'
    
    find('#attendee_name').native.send_key(:return)

    expect(page).to have_field 'attendee_name', :with => ''
    
    expect(page).to have_content 'AUTHOR: a name'
    
    visit attendee_IDE_with_NO_code_to_display_no_session    
    
    expect(page).to have_content 'AUTHOR: a name'
    
  end
  
  it 'should keep author name after a run' do
    
    visit attendee_IDE_with_NO_code_to_display
    
    expect(page).to have_content 'HELPER 1'    
    
    fill_in 'attendee_name', :with => "a name"
    
    find('#attendee_name').native.send_key(:return)
    
    expect(page).to have_content 'AUTHOR: a name'
    
    fill_IDE_with('print "something"')
    
    execute

    expect(page).to have_content 'AUTHOR: a name'
    
    $db.execute_sql("update teacher_current_slide set current_slide_id = '1'")    
    
    press_space
    
    expect(page).to have_content 'HELPER 2'    
    
    expect(page).to have_content 'AUTHOR: a name'

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
	  
    visit teacher_coding_presentation

    go_right
       
    visit attendee_IDE_with_code_to_display
    
    press_space
    
    expect(page).to have_content "HELPER 2"
    expect(page).to have_content "print 'ADDED CODE'"   
    
    expect_IDE_to_have(code_input = "", code_output = "ADDED CODE")    

  end  
  
  it 'should run last attendee code (not teacher code)' do
	  
    visit teacher_coding_presentation

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