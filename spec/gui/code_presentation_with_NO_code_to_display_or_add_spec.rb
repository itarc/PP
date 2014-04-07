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
attendee_IDE_with_NO_code_to_display = '/attendee/coding_slide_with_NO_code_to_display'

get teacher_coding_presentation do
  session[:user_id] = '0'
  redirect "coding_presentation-teacher.html"
end

get attendee_IDE_with_NO_code_to_display do
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

describe 'Teacher Presentation', :type => :feature, :js => true do
	
  before(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end	
  
  it 'should show IDE when down arrow is pressed' do

    visit teacher_coding_presentation
    
    expect(page).to have_content 'EXERCISE - 1'
    
    go_down

    expect_IDE_to_be_empty
    
  end

  it 'should show current slide when up arrow is pressed' do

    visit teacher_coding_presentation

    expect(page).to have_content 'EXERCISE - 1'

    go_down
    go_right 
    go_up

    expect(page).to have_content 'EXERCISE - 2'
    
  end

  after(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end  
  
end
  
describe 'Teacher IDE', :type => :feature, :js => true do  
	
  before(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide") 
  end

  it 'should be empty when initialized' do

    visit teacher_coding_presentation
    
    go_down
    
    expect_IDE_to_be_empty
    
  end
  
  it 'should display result when code is executed' do

    visit teacher_coding_presentation
    
    go_down
    
    fill_in 'code_input', :with => 'print "something"'
    
    fill_IDE_with('print "something"')
    
    execute

    expect_IDE_to_have(code_input = 'print "something"', code_output = 'something')
    
  end  

  it 'should display result when code with utf-8 characters is executed' do

    visit teacher_coding_presentation
    
    go_down    
    
    fill_IDE_with('print "éèêàâùï"')
    
    execute
    
    expect(find_field('code_output').value).to have_content 'invalid multibyte char (US-ASCII)'
    
    fill_IDE_with("#encoding: utf-8" + "\n" + 'print "éèêàâùï"')    
    
    execute
    
    expect_IDE_to_have(code_input = "#encoding: utf-8" + "\n" + 'print "éèêàâùï"', code_output = 'éèêàâùï')    
    
  end  

  it 'should show current code_helper' do
	  
    visit teacher_coding_presentation

   go_down

    expect(page).to have_content 'HELPER 1'	  

    go_right

    expect(page).to have_content 'HELPER 2'

    go_left

    expect(page).to have_content 'HELPER 1'
	  
  end
  
  after(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end   

end


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
  
  after(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end  

end


