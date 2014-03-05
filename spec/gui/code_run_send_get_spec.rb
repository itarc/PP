require 'rspec'
require 'capybara/rspec'

## SINATRA CONTROLLER (BEGIN)

require_relative '../../controllers/slideshow.rb'

Capybara.app = Sinatra::Application.new

set :public_folder, 'fixtures'
set :logging, false

TEACHER_CODING_PRESENTATION_3 = '/teacher/coding_presentation'
ATTENDEE_CODING_SLIDE_WITH_ALT_R_AND_ALTS = '/attendee/coding_slide_with_NO_code_to_display'

get '/attendee/coding_slide_with_NO_code_to_display' do
  redirect "coding_slide_with_NO_code_to_display-attendee.html"
end

get '/teacher/coding_presentation' do	
  redirect "coding_presentation-teacher.html"
end

## SINATRA CONTROLLER (END)

describe 'Alt-R, Alt-S behaviour', :type => :feature, :js => true do

  before(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end
  
  it 'should NOT show current slide last run (from any attendee) when space pressed' do   

    visit TEACHER_CODING_PRESENTATION_3
    
    find(:css, 'div.presentation').native.send_key(:arrow_down)    
    
    expect(page).to have_field 'code_input', :with => ""
    expect(page).to have_field 'code_output', :with => ""
    
    run_ruby "run", 'print "attendee run"', "attendee 1", "0"

    find(:css, 'div.presentation').native.send_key(:space)
    
    expect(page).to have_field 'code_input', :with => ""
    expect(page).to have_field 'code_output', :with => ""
    
  end   
  
  it 'should show current slide last send (from any attendee) when space pressed' do   

    visit TEACHER_CODING_PRESENTATION_3
    
    find(:css, 'div.presentation').native.send_key(:arrow_down)    
    
    expect(page).to have_field 'code_input', :with => ""
    expect(page).to have_field 'code_output', :with => ""
    
    run_ruby "send", 'print "attendee send"', "attendee 1", "0"

    find(:css, 'div.presentation').native.send_key(:space)
    
    expect(page).to have_field 'code_input', :with => 'print "attendee send"'
    expect(page).to have_field 'code_output', :with => 'attendee send'
    
  end 

  
  it 'should NOT show current slide last send when space pressed and no last send for current slide' do   

    visit TEACHER_CODING_PRESENTATION_3
    
    find(:css, 'div.presentation').native.send_key(:arrow_down)    
    
    expect(page).to have_field 'code_input', :with => ""
    expect(page).to have_field 'code_output', :with => ""
    
    run_ruby "send", 'print "attendee send"', "attendee 1", "0"
    
    find(:css, 'div.presentation').native.send_key(:arrow_right)

    find(:css, 'div.presentation').native.send_key(:space)
    
    expect(page).to have_field 'code_input', :with => ''
    expect(page).to have_field 'code_output', :with => '' # no run on this slide
    
    find(:css, 'div.presentation').native.send_key(:arrow_left) 

    find(:css, 'div.presentation').native.send_key(:space)
    
    expect(page).to have_field 'code_input', :with => 'print "attendee send"'
    expect(page).to have_field 'code_output', :with => 'attendee send'

    find(:css, 'div.presentation').native.send_key(:arrow_right)

    expect(page).to have_field 'code_input', :with => 'print "attendee send"'
    expect(page).to have_field 'code_output', :with => 'attendee send'

    find(:css, 'div.presentation').native.send_key(:space)
    
    expect(page).to have_field 'code_input', :with => 'print "attendee send"'
    expect(page).to have_field 'code_output', :with => 'attendee send'    
    
  end  
  
  it 'should NOT show current slide last run (from any attendee) when attendee RUN code and then teacher space pressed' do   

    visit TEACHER_CODING_PRESENTATION_3
    
    find(:css, 'div.presentation').native.send_key(:arrow_down)    
    
    expect(page).to have_field 'code_input', :with => ""
    expect(page).to have_field 'code_output', :with => ""
    
    run_ruby "run", 'print "attendee run"', "attendee 1", "0"

    find(:css, 'div.presentation').native.send_key(:space)
    
    expect(page).to have_field 'code_input', :with => ""
    expect(page).to have_field 'code_output', :with => ""
    
  end  

  it 'should show current slide last send (from any attendee) when attendee SEND code and then teacher space pressed' do   

    visit TEACHER_CODING_PRESENTATION_3
    
    find(:css, 'div.presentation').native.send_key(:arrow_down)    
    
    expect(page).to have_field 'code_input', :with => ""
    expect(page).to have_field 'code_output', :with => ""
    
    run_ruby "send", 'print "attendee send"', "attendee 1", "0"

    find(:css, 'div.presentation').native.send_key(:space)
    
    expect(page).to have_field 'code_input', :with => 'print "attendee send"'
    expect(page).to have_field 'code_output', :with => 'attendee send'
    
  end

  after(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end    

end