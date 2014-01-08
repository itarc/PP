require 'rspec'
require 'capybara/rspec'

require_relative '../../controllers/slideshow.rb'
require_relative 'spec.controller'

Capybara.app = Sinatra::Application.new

set :logging, false

CODING_SLIDE = '/coding_slide'


describe 'Coding Slide', :type => :feature do
  
  it 'should display one coding area and a result area' do

    visit CODING_SLIDE
    
    expect(page).to have_field 'input', :with => ""
    expect(page).to have_field 'output', :with => ""
    
  end
  
  it 'should show show "result" when puts "result" is executed' do

    visit CODING_SLIDE

    fill_in 'input', :with => 'puts "result"'
    click_on 'execute'
    expect(page).to have_field 'output', :with => "result"    
    
  end  

end