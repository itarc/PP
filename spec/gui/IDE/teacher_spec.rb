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

describe 'Teacher Presentation', :type => :feature, :js => true do
	
  before(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end	
  
  it 'should show IDE when down arrow is pressed' do

    visit teacher_presentation
    
    expect(page).to have_content 'EXERCISE - 1'
    
    go_down

    expect_IDE_to_be_empty
    
  end

  it 'should show current slide when up arrow is pressed' do

    visit teacher_presentation

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

    visit teacher_presentation
    
    go_down
    
    expect_IDE_to_be_empty
    
  end
  
  it 'should display result when code is ran' do

    visit teacher_presentation
    
    go_down
    
    fill_in 'code_input', :with => 'print "something"'
    
    fill_IDE_with('print "something"')
    
    execute

    expect_IDE_to_have(code_input = 'print "something"', code_output = 'something')
    
  end  

  it 'should display result when code with utf-8 characters is ran' do

    visit teacher_presentation
    
    go_down    
    
    fill_IDE_with('print "éèêàâùï"')
    
    execute
    
    expect(find_field('code_output').value).to have_content 'invalid multibyte char (US-ASCII)'
    
    fill_IDE_with("#encoding: utf-8" + "\n" + 'print "éèêàâùï"')    
    
    execute
    
    expect_IDE_to_have(code_input = "#encoding: utf-8" + "\n" + 'print "éèêàâùï"', code_output = 'éèêàâùï')    
    
  end  

  it 'should show current code_helper' do
	  
    visit teacher_presentation

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

describe 'Teacher IDE update', :type => :feature, :js => true do

  before(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end
  
  it 'should NOT show attendee last run' do   

    visit teacher_presentation
    go_down
    
    expect_IDE_to_be_empty
    
    run_ruby "run", 'print "attendee run"', "attendee 1", "0"
    
    press_space
    
    expect_IDE_to_be_empty
    
  end 
  
  it 'should show attendee last send with attendee name' do   

    visit teacher_presentation
    go_down 
    
    expect_IDE_to_be_empty
    
    run_ruby "send", 'print "attendee send"', "attendee 1", "0"
    
    press_space
    
    expect_IDE_to_have(code_input = 'print "attendee send"', code_output = 'attendee send')
    
    expect_AuthorBar_to_have(author='attendee 1')
    
  end
  
  it 'should show teacher last run when teacher last run is fresher than attendee last send' do   

    visit teacher_presentation
    go_down 
    
    expect_IDE_to_be_empty
    
    run_ruby "send", 'print "attendee send"', "attendee 1", "0"
    
    press_space
    
    expect_IDE_to_have(code_input = 'print "attendee send"', code_output = 'attendee send')
    
    expect_AuthorBar_to_have(author='attendee 1')    
    
    fill_IDE_with('print "new code to run"')
    
    execute
    
    expect_IDE_to_have(code_input = 'print "new code to run"', code_output = 'new code to run')    
    
    expect_AuthorBar_to_have(author='#')
    
    press_space
    
    expect_IDE_to_have(code_input = 'print "new code to run"', code_output = 'new code to run')
    
    expect_AuthorBar_to_have(author='#')    
    
  end  
  
  it 'should NOT show attendee last send when attendee last send is on another slide' do   

    visit teacher_presentation
    go_down   
    
    expect_IDE_to_be_empty
    
    run_ruby "send", 'print "attendee send"', "attendee 1", "0"
    
    go_right
    press_space
    
    expect_IDE_to_be_empty

  end  

  it 'should NOT show teacher last run when teacher last run on another slide' do
    
    visit teacher_presentation
    go_down
    
    expect_IDE_to_be_empty    
    
    fill_IDE_with("print 'code to run'")
    
    execute
    
    expect_IDE_to_have(code_input = "print 'code to run'", code_output = 'code to run')
    
    go_right
    
    visit teacher_presentation
    go_down    
    
    expect_IDE_to_be_empty

  end  
  
  it 'should keep showing last atendee send when navigating right' do   

    visit teacher_presentation
    go_down
    
    expect_IDE_to_be_empty
    
    run_ruby "send", 'print "attendee send"', "attendee 1", "0"
    
    go_right
    
    expect_IDE_to_be_empty   
    
    go_left
    
    expect_IDE_to_have(code_input = 'print "attendee send"', code_output = 'attendee send')
    
    expect_AuthorBar_to_have(author='attendee 1')    
    
    go_right

    expect_IDE_to_have(code_input = 'print "attendee send"', code_output = 'attendee send') 

    expect_AuthorBar_to_have(author='attendee 1')
    
  end    
  
  after(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end    
	
end