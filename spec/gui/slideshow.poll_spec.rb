require 'rspec'
require 'capybara/rspec'

require_relative 'controllers.slideshow.rb'

Capybara.app = Sinatra::Application.new

describe 'Poll', :type => :feature, :js => true do
	
  it 'should display the poll' do
	  
    visit '/slideshow_fixture_poll.html'
    
    expect(page).to have_content "POLL"
    expect(page).to have_content "QUESTION"
    expect(page).to have_content "ANSWER_1"
    expect(page).to have_content "ANSWER_2"
    
  end

  it 'should display a poll result' do
	  
    visit '/slideshow_fixture_poll.html'
    
    # choose("ANSWER_1")
    #find(:css, 'div.presentation').native.send_key(:arrow_right)    
    
    #expect(page).to have_content "POLL"
    #expect(page).to have_content "QUESTION"
    #expect(page).to have_content "ANSWER_1 (100%)"
    #expect(page).to have_content "ANSWER_2 (0%)"
    
  end
  
  it 'should display another poll result' do
	  
    visit '/slideshow_fixture_poll.html'
    
    # choose("ANSWER_2")
    # may not work with xvfb because window is not maximized so the radio button is not visibie.
    # one solution is to maximize the window before each test "Capybara.current_session.driver.browser.manage.window.resize_to(width, height)" 
    # or to use page.find(*args).click
    page.find("#poll_radio_2").click
    #~ page.find("label", :text => "ANSWER_2").click
    # page.find("#label_2").click    
    find(:css, 'div.presentation').native.send_key(:arrow_right)    
    
    expect(page).to have_content "POLL"
    expect(page).to have_content "QUESTION"
    expect(page).to have_content "ANSWER_1 (0%)"
    expect(page).to have_content "ANSWER_2 (100%)"
    
  end  
  
end
