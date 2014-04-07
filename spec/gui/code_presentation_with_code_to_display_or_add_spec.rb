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
attendee_IDE_with_code_to_display = '/attendee/coding_slide_with_code_to_display'

get teacher_coding_presentation do
  session[:user_id] = '0'
  redirect "coding_presentation-teacher.html"
end

get attendee_IDE_with_code_to_display do
  session[:user_id] = '1'	
  redirect "coding_slide_with_code_to_display-attendee.html"
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

describe 'Attendee IDE', :type => :feature, :js => true do
	
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
