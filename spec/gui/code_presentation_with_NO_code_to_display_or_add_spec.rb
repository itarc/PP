require 'rspec'
require 'capybara/rspec'

## SINATRA CONTROLLER (BEGIN)

require_relative '../../controllers/slideshow.rb'

Capybara.app = Sinatra::Application.new

set :public_folder, 'fixtures'
set :logging, false

TEACHER_CODING_PRESENTATION = '/teacher/coding_presentation'
ATTENDEE_CODING_SLIDE_WITH_NO_CODE_TO_DISPPLAY = '/attendee/coding_slide_with_NO_code_to_display'

get '/attendee/coding_slide_with_NO_code_to_display' do
  redirect "coding_slide_with_NO_code_to_display-attendee.html"
end

get '/teacher/coding_presentation' do	
  redirect "coding_presentation-teacher.html"
end

## SINATRA CONTROLLER (END)

describe 'Teacher Code Presentation', :type => :feature, :js => true do
	
  before(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end	
  
  it 'should show code slide when down arrow is pressed' do

    visit TEACHER_CODING_PRESENTATION
    
    expect(page).to have_no_field 'code_input', :with => "", :visible => true
    expect(page).to have_no_field 'code_output', :with => "", :visible => true
    
    find(:css, 'div.presentation').native.send_key(:arrow_down)

    expect(page).to have_field 'code_input', :with => "", :visible => true
    expect(page).to have_field 'code_output', :with => "", :visible => true
    
  end

  it 'should show current slide when up is pressed' do

    visit TEACHER_CODING_PRESENTATION

    expect(page).to have_content 'EXERCISE - 1'

    find(:css, 'div.presentation').native.send_key(:arrow_down)
    find(:css, 'div.presentation').native.send_key(:arrow_right)   
    find(:css, 'div.presentation').native.send_key(:arrow_up)    

    expect(page).to have_content 'EXERCISE - 2'
    
  end

  after(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end  
  
end
  
describe 'Teacher Code Slide', :type => :feature, :js => true do  
	
  before(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide") 
  end

  it 'should be empty when initialized' do

    visit TEACHER_CODING_PRESENTATION
    
    find(:css, 'div.presentation').native.send_key(:arrow_down)
    
    expect(page).to have_field 'code_input', :with => "", :visible => true
    expect(page).to have_field 'code_output', :with => "", :visible => true
    
  end
  
  it 'should display result when code is executed' do

    visit TEACHER_CODING_PRESENTATION
    
    find(:css, 'div.presentation').native.send_key(:arrow_down)    
    
    fill_in 'code_input', :with => 'print "something"'
    click_on 'execute'
    
    expect(page).to have_field 'code_output', :with => 'something'
    
  end   

  it 'should show current code_helper' do
	  
    visit TEACHER_CODING_PRESENTATION

    find(:css, 'div.presentation').native.send_key(:arrow_down)

    expect(page).to have_content 'HELPER 1'	  

    find(:css, 'div.presentation').native.send_key(:arrow_right)

    expect(page).to have_content 'HELPER 2'

    find(:css, 'div.presentation').native.send_key(:arrow_left)

    expect(page).to have_content 'HELPER 1'
	  
  end
  
  it 'should show current slide last run (from any attendee) when space pressed' do   

    visit TEACHER_CODING_PRESENTATION
    
    find(:css, 'div.presentation').native.send_key(:arrow_down)    
    
    expect(page).to have_field 'code_input', :with => ""
    expect(page).to have_field 'code_output', :with => ""
    
    run_ruby 'print "attendee run"', "attendee 1", "0"

    find(:css, 'div.presentation').native.send_key(:space)
    
    expect(page).to have_field 'code_input', :with => 'print "attendee run"'
    expect(page).to have_field 'code_output', :with => 'attendee run'
    
  end 

  
  it 'should NOT show current slide last run when space pressed and no last run for current slide' do   

    visit TEACHER_CODING_PRESENTATION
    
    find(:css, 'div.presentation').native.send_key(:arrow_down)    
    
    expect(page).to have_field 'code_input', :with => ""
    expect(page).to have_field 'code_output', :with => ""
    
    run_ruby 'print "attendee run"', "attendee 1", "0"
    
    find(:css, 'div.presentation').native.send_key(:arrow_right)

    find(:css, 'div.presentation').native.send_key(:space)
    
    expect(page).to have_field 'code_input', :with => ''
    expect(page).to have_field 'code_output', :with => '' # no run on this slide
    
    find(:css, 'div.presentation').native.send_key(:arrow_left) 

    find(:css, 'div.presentation').native.send_key(:space)
    
    expect(page).to have_field 'code_input', :with => 'print "attendee run"'
    expect(page).to have_field 'code_output', :with => 'attendee run'

    find(:css, 'div.presentation').native.send_key(:arrow_right)

    expect(page).to have_field 'code_input', :with => 'print "attendee run"'
    expect(page).to have_field 'code_output', :with => 'attendee run'

    find(:css, 'div.presentation').native.send_key(:space)
    
    expect(page).to have_field 'code_input', :with => 'print "attendee run"'
    expect(page).to have_field 'code_output', :with => 'attendee run'    
    
  end 
  
  after(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end   

end


describe 'Attendee Code Slide', :type => :feature, :js => true do
	
  before(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end	
  
  it 'should be empty when initialized' do

    visit ATTENDEE_CODING_SLIDE_WITH_NO_CODE_TO_DISPPLAY
    
    expect(page).to have_field 'code_input', :with => "", :visible => true
    expect(page).to have_field 'code_output', :with => "", :visible => true
    
  end 
  
  it 'should display result when code is executed' do

    visit ATTENDEE_CODING_SLIDE_WITH_NO_CODE_TO_DISPPLAY
    
    fill_in 'code_input', :with => 'print "something"'
    click_on 'execute'
    
    expect(page).to have_field 'code_output', :with => 'something'
    
  end  

  it 'should display current code_helper' do

    visit TEACHER_CODING_PRESENTATION

    expect(page).to have_content 'EXERCISE - 1'
    
    visit ATTENDEE_CODING_SLIDE_WITH_NO_CODE_TO_DISPPLAY

    expect(page).to have_content 'HELPER 1'

    visit TEACHER_CODING_PRESENTATION
    find(:css, 'div.presentation').native.send_key(:arrow_right)
    
    visit ATTENDEE_CODING_SLIDE_WITH_NO_CODE_TO_DISPPLAY
    find(:css, 'div.presentation').native.send_key(:space)     

    expect(page).to have_content 'HELPER 2'

    visit TEACHER_CODING_PRESENTATION
    find(:css, 'div.presentation').native.send_key(:arrow_left)
    
    visit ATTENDEE_CODING_SLIDE_WITH_NO_CODE_TO_DISPPLAY
    find(:css, 'div.presentation').native.send_key(:space)     

    expect(page).to have_content 'HELPER 1'
    
  end  
  
  after(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end  

end
