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

describe 'Attendee IDE', :type => :feature, :js => true do
	
  before(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")        
  end	

  it 'should run code to display' do
       
    visit attendee_IDE_with_code_to_display
    
    within '#code_helper_1' do
      expect(page).to have_content "HELPER 1"
      expect(page).to have_no_content "print 'DISPLAYED CODE'"
    end    
    
    expect(page).to have_field 'code_input', :with => "print 'DISPLAYED CODE'"
    expect(page).to have_field 'code_output', :with => "DISPLAYED CODE"

  end  
  
  it 'should run code to add without displaying it' do
	  
    visit teacher_coding_presentation

    find(:css, 'div.presentation').native.send_key(:arrow_right)
       
    visit attendee_IDE_with_code_to_display
    
    find(:css, 'div.presentation').native.send_key(:space)
    
    within '#code_helper_2' do
      expect(page).to have_content "HELPER 2"
      expect(page).to have_content "print 'ADDED CODE'"
    end    
    
    expect(page).to have_field 'code_input', :with => ""
    expect(page).to have_field 'code_output', :with => "ADDED CODE"

  end  
  
  it 'should run last attendee code (not teacher code)' do
	  
    visit teacher_coding_presentation

    find(:css, 'div.presentation').native.send_key(:down)
    
    fill_in 'code_input', :with => "puts 'TEACHER CODE'" 
   
    click_button 'execute'  
       
    visit attendee_IDE_with_code_to_display
    
    expect(page).to have_field 'code_input', :with => "print 'DISPLAYED CODE'"
    expect(page).to have_field 'code_output', :with => "DISPLAYED CODE"

  end    
  
  after(:each) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")        
  end    

end
