require 'rspec'
require 'capybara/rspec'

require_relative 'controllers.slideshow.rb'

Capybara.app = Sinatra::Application.new

set :logging, false
 
describe 'Slideshow', :type => :feature, :js => true do
	
  it 'should display current slide only' do
	  
    visit '/slideshow_fixture_navigation.html'
    
    expect(page).to have_content "SLIDE 1"
    expect(page).to have_no_content "SLIDE 2"
    
  end
  
  it 'should go to next slide when right arrow pressed' do

    visit '/slideshow_fixture_navigation.html'
    
    find(:css, 'div.presentation').native.send_key(:arrow_right)

    expect(page).to have_no_content "SLIDE 1"
    expect(page).to have_content "SLIDE 2"

  end  
  
  it 'should go back to previous slide when left arrow pressed' do

    visit '/slideshow_fixture_navigation.html'
    
    find(:css, 'div.presentation').native.send_key(:arrow_right)
    find(:css, 'div.presentation').native.send_key(:arrow_left)

    expect(page).to have_content "SLIDE 1"
    expect(page).to have_no_content "SLIDE 2"

  end
  
  it 'should synchronise with server when spacebar pressed' do

    visit '/slideshow_fixture_navigation.html'
    
    find(:css, 'div.presentation').native.send_key(:arrow_right)
    find(:css, 'div.presentation').native.send_key(:space)

    expect(page).to have_no_content "SLIDE 1"
    expect(page).to have_content "SLIDE 2"

  end  

end  


  
