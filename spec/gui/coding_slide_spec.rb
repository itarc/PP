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
    
    expect(page).to have_field 'code_output', :with => "something"
    
  end  

end
