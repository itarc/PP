require 'rspec'
require 'capybara/rspec'

require_relative '../../controllers/slideshow.rb'
require_relative 'spec.controller'

Capybara.app = Sinatra::Application.new

set :logging, false

TEACHER_CODING_PRESENTATION = '/teacher/coding_presentation'
ATTENDEE_CODING_SLIDE = '/attendee/coding_slide'


describe 'Coding Presentation', :type => :feature, :js => true do
  
  it 'should display show a coding slide when down array is pressed' do

    visit TEACHER_CODING_PRESENTATION
    
    expect(page).to have_no_field 'code_input', :with => "", :visible => true
    expect(page).to have_no_field 'code_output', :with => "", :visible => true
    
    find(:css, 'div.presentation').native.send_key(:arrow_down)

    expect(page).to have_field 'code_input', :with => "", :visible => true
    expect(page).to have_field 'code_output', :with => "", :visible => true
    
  end

  it 'should display show return to current slide when up is pressed' do

    visit TEACHER_CODING_PRESENTATION

    expect(page).to have_content 'EXERCISE - 1'

    find(:css, 'div.presentation').native.send_key(:arrow_down)
    find(:css, 'div.presentation').native.send_key(:arrow_right)   
    find(:css, 'div.presentation').native.send_key(:arrow_up)    

    expect(page).to have_content 'EXERCISE - 2'
    
  end
  
  it 'should display right code_helper on attendee slideshow' do

    visit TEACHER_CODING_PRESENTATION

    expect(page).to have_content 'EXERCISE - 1'
    
    visit ATTENDEE_CODING_SLIDE

    expect(page).to have_content 'HELPER 1'

    visit TEACHER_CODING_PRESENTATION
    find(:css, 'div.presentation').native.send_key(:arrow_right)
    
    visit ATTENDEE_CODING_SLIDE
    find(:css, 'div.presentation').native.send_key(:space)     

    expect(page).to have_content 'HELPER 2'

    visit TEACHER_CODING_PRESENTATION
    find(:css, 'div.presentation').native.send_key(:arrow_left)
    
    visit ATTENDEE_CODING_SLIDE
    find(:css, 'div.presentation').native.send_key(:space)     

    expect(page).to have_content 'HELPER 1'
    
  end  

  it 'should display right code_helper on teacher coding slide' do
	  
    visit TEACHER_CODING_PRESENTATION

    find(:css, 'div.presentation').native.send_key(:arrow_down)

    expect(page).to have_content 'HELPER 1'	  

    find(:css, 'div.presentation').native.send_key(:arrow_right)

    expect(page).to have_content 'HELPER 2'

    find(:css, 'div.presentation').native.send_key(:arrow_left)

    expect(page).to have_content 'HELPER 1'
	  
  end

end
