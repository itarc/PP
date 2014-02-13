require 'rspec'
require 'capybara/rspec'


## SINATRA CONTROLLER (BEGIN)

require_relative '../../controllers/slideshow.rb'

Capybara.app = Sinatra::Application.new

set :public_folder, 'fixtures'
set :logging, false

TEACHER_CODING_PRESENTATION_2 = '/teacher/coding_presentation'
ATTENDEE_CODING_SLIDE_WITH_CODE_TO_DISPLAY = '/attendee/coding_slide_with_code_to_display'

get '/attendee/coding_slide_with_code_to_display' do
  session[:user_id] = 1	
  redirect "coding_slide_with_code_to_display-attendee.html"
end

get '/teacher/coding_presentation' do
  session[:user_id] = 0	
  redirect "coding_presentation-teacher.html"
end

## SINATRA CONTROLLER (END)

describe 'Attendee Code Slide', :type => :feature, :js => true do
	
  before(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")        
  end	

  it 'should run code to display' do
       
    visit ATTENDEE_CODING_SLIDE_WITH_CODE_TO_DISPLAY
    
    within '#code_helper_1' do
      expect(page).to have_content "HELPER 1"
      expect(page).to have_no_content "print 'DISPLAYED CODE'"
    end    
    
    expect(page).to have_field 'code_input', :with => "print 'DISPLAYED CODE'"
    expect(page).to have_field 'code_output', :with => "DISPLAYED CODE"

  end  
  
  it 'should run code to add without displaying it' do
	  
    visit TEACHER_CODING_PRESENTATION_2

    find(:css, 'div.presentation').native.send_key(:arrow_right)
       
    visit ATTENDEE_CODING_SLIDE_WITH_CODE_TO_DISPLAY
    
    find(:css, 'div.presentation').native.send_key(:space)
    
    within '#code_helper_2' do
      expect(page).to have_content "HELPER 2"
      expect(page).to have_content "print 'ADDED CODE'"
    end    
    
    expect(page).to have_field 'code_input', :with => ""
    expect(page).to have_field 'code_output', :with => "ADDED CODE"

  end  
  
  it 'should run last attendee code (not teacher code)' do
	  
    visit TEACHER_CODING_PRESENTATION_2

    find(:css, 'div.presentation').native.send_key(:down)
    
    fill_in 'code_input', :with => "puts 'TEACHER CODE'" 
   
    click_button('execute')   
       
    visit ATTENDEE_CODING_SLIDE_WITH_CODE_TO_DISPLAY
    
    expect(page).to have_field 'code_input', :with => "print 'DISPLAYED CODE'"
    expect(page).to have_field 'code_output', :with => "DISPLAYED CODE"

  end    
  
  after(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")        
  end    

end
