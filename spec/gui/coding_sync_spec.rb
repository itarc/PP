require 'rspec'
require 'capybara/rspec'

require_relative '../../controllers/slideshow.rb'
require_relative 'spec.controller'

Capybara.app = Sinatra::Application.new

set :logging, false

TEACHER_CODING_PRESENTATION_SYNC = '/teacher/coding_presentation'
TEACHER_CODING_SLIDE_SYNC = '/teacher/coding_slide'
ATTENDEE_CODING_SLIDE_SYNC = '/attendee/coding_slide'


describe 'Coding Slide', :type => :feature, :js => true do
	
  before(:each) do
    $db.execute_sql("delete from run_events") 
  end	
  
  it 'should display teacher coding slide with one empty coding area and an empty result area' do

    visit TEACHER_CODING_SLIDE_SYNC
    
    expect(page).to have_field 'code_input', :with => ""
    expect(page).to have_field 'code_output', :with => ""
    
  end
  
  it 'should display attendee coding slide with one empty coding area and an empty result area' do

    visit ATTENDEE_CODING_SLIDE_SYNC
    
    expect(page).to have_field 'code_input', :with => ""
    expect(page).to have_field 'code_output', :with => ""
    
  end  
  
  it 'should show "something" when puts "something" is executed on teacher coding slide' do

    visit TEACHER_CODING_SLIDE_SYNC
    
    fill_in 'code_input', :with => 'print "something"'
    click_on 'execute'
    
    expect(page).to have_field 'code_output', :with => 'something'
    
  end

  it 'should show "something" when puts "something" is executed on attendee coding slide'  do

    visit ATTENDEE_CODING_SLIDE_SYNC
    
    fill_in 'code_input', :with => 'print "something"'
    click_on 'execute'
    
    expect(page).to have_field 'code_output', :with => 'something'
    
  end

  it 'should synchronised with last attendee run when space pressed on teacher slide' do   

    visit ATTENDEE_CODING_SLIDE_SYNC
    
    fill_in 'code_input', :with => 'print "something new"'
    click_on 'execute'

    visit TEACHER_CODING_SLIDE_SYNC
    
    expect(page).to have_field 'code_input', :with => ""
    expect(page).to have_field 'code_output', :with => ""

    find(:css, 'div.presentation').native.send_key(:space)
    
    expect(page).to have_field 'code_input', :with => 'print "something new"'
    expect(page).to have_field 'code_output', :with => 'something new'
    
  end

  it 'should display show a coding slide when down array is pressed' do

    visit ATTENDEE_CODING_SLIDE_SYNC
    
    fill_in 'code_input', :with => 'print "something very new"'
    click_on 'execute'
    
   visit TEACHER_CODING_PRESENTATION_SYNC
    
    find(:css, 'div.presentation').native.send_key(:arrow_down)

    find(:css, 'div.presentation').native.send_key(:space)
    
    expect(page).to have_field 'code_input', :with => 'print "something very new"'
    expect(page).to have_field 'code_output', :with => 'something very new'
    
  end
  
  after(:each) do
    $db.execute_sql("delete from run_events") 
  end    

end
