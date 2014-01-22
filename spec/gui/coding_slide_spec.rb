require 'rspec'
require 'capybara/rspec'

require_relative '../../controllers/slideshow.rb'
require_relative 'spec.controller'

Capybara.app = Sinatra::Application.new

set :logging, false

CODING_SLIDE = '/coding_slide'


describe 'Coding Slide', :type => :feature, :js => true do
  
  it 'should display one coding area and a result area' do

    visit CODING_SLIDE
    
    expect(page).to have_field 'code_input', :with => ""
    expect(page).to have_field 'code_output', :with => ""
    
  end
  
  it 'should show "something" when puts "something" is executed' do

    visit CODING_SLIDE
    
    fill_in 'code_input', :with => 'print "something"'
    click_on 'execute'
    
    within('#code_output') do
      expect(page).to have_content "something"
    end    
    
  end 

  it 'should execute unit/tests' do

    visit CODING_SLIDE
    
    fill_in 'code_input', :with => 'require "test/unit"'
    click_on 'execute'
    
    within('#code_output') do
      expect(page).to have_content "0 tests, 0 assertions, 0 failures, 0 errors, 0 skips"
    end
    
  end 

end
