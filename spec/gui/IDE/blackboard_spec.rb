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
attendee_coding_presentation = '/attendee/coding_slide_with_NO_code_to_display'
blackboard = '/attendee/blackboard'
blackboard_with_code_to_display = '/attendee/blackboard_with_code_to_display'

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

get blackboard_with_code_to_display do  
  redirect "coding_presentation_with_code_to_display-blackboard.html"
end

## -------------------------------------------------------
## SINATRA CONTROLLER (END)
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
    
    execute
    
    expect_IDE_to_have(code_input = "print 'attendee run'", code_output = "attendee run")    
    
    visit blackboard
    
    expect_IDE_to_be_empty   

    visit attendee_coding_presentation
    
    fill_IDE_with("print 'attendee send'")
    
    send_code
    
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
    
    execute
    
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
