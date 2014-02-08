require 'rspec'
require 'capybara/rspec'

require_relative '../../controllers/slideshow.rb'
require_relative 'spec.controller'

Capybara.app = Sinatra::Application.new

set :logging, false

TEACHER_CODING_PRESENTATION_HELPER = '/teacher/coding_presentation'
ATTENDEE_CODING_SLIDE_HELPER = '/attendee/coding_slide'

describe 'Code Helper', :type => :feature, :js => true do
	
  before(:each) do
    $db.execute_sql("delete from run_events") 
  end	
  
  it 'should change code helper when left arrow pressed' do

    visit ATTENDEE_CODING_SLIDE_HELPER

    expect(page).to have_selector '#code_helper_1', :text => "HELPER 1", :visible => true
    expect(page).to have_no_selector '#code_helper_2', :text => "HELPER 2", :visible => true
 
    visit TEACHER_CODING_PRESENTATION_HELPER
    find(:css, 'div.presentation').native.send_key(:arrow_right)  
    
    visit ATTENDEE_CODING_SLIDE_HELPER
    find(:css, 'div.presentation').native.send_key(:space)      
    
    expect(page).to have_no_selector '#code_helper_1', :text => "HELPER 1", :visible => true
    expect(page).to have_selector '#code_helper_2', :text => "HELPER 2", :visible => true

    visit TEACHER_CODING_PRESENTATION_HELPER
    find(:css, 'div.presentation').native.send_key(:arrow_left)
    
    visit ATTENDEE_CODING_SLIDE_HELPER
    find(:css, 'div.presentation').native.send_key(:space) 

    expect(page).to have_selector '#code_helper_1', :text => "HELPER 1", :visible => true
    expect(page).to have_no_selector '#code_helper_2', :text => "HELPER 2", :visible => true

  end
  
  it 'should place code into editor when code is present in code helper' do
       
    visit ATTENDEE_CODING_SLIDE_HELPER
    
    within '#code_helper_1' do
      expect(page).to have_content "HELPER 1"
      expect(page).to have_no_content "print 'HELPER CODE'"
    end    
    
    expect(page).to have_field 'code_input', :with => "print 'HELPER CODE'"
    expect(page).to have_field 'code_output', :with => "HELPER CODE"

  end  
  
  after(:each) do
    $db.execute_sql("delete from run_events") 
  end    

end
