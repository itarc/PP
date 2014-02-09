require 'rspec'
require 'capybara/rspec'

require_relative '../../controllers/slideshow.rb'
require_relative 'spec.controller'

Capybara.app = Sinatra::Application.new

set :logging, false

ATTENDEE_CODING_SLIDE_WITH_CODE_TO_DISPLAY = '/attendee/coding_slide_with_code_to_display'

describe 'Attendee Code Slide', :type => :feature, :js => true do
	
  before(:each) do
    $db.execute_sql("delete from run_events") 
  end	

  
  it 'should display code help into code editor and execute it' do
       
    visit ATTENDEE_CODING_SLIDE_WITH_CODE_TO_DISPLAY
    
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
