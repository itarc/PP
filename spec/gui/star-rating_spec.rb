require 'rspec'
require 'capybara/rspec'

require_relative '../../controllers/slideshow.rb'
require_relative 'spec.controller.rb'

Capybara.app = Sinatra::Application.new

set :logging, false

ATTENDEE_RATE_SLIDE = '/star_rating'

describe 'Star Rating with ONE attendee', :type => :feature, :js => true do
  
  before(:each) do
    $db.execute_sql("delete from polls") 
  end
  
  it 'should save a rating of 1 when attendee clicks on first star' do
    
    # attendee.click_on(:first_star)
    visit ATTENDEE_RATE_SLIDE
    find("#rating_input_1_to_global_evaluation").click
    
    expect(db_rating).to be 1

  end   
  
  it 'should save a rating of 2 when attendee clicks on first star' do
    
    # attendee.click_on(:first_star)
    visit ATTENDEE_RATE_SLIDE
    find("#rating_input_2_to_global_evaluation").click
    
    # inspect database
    expect(db_rating).to be 2

  end     

  it 'should save a rating of 3 when attendee clicks on first star' do
    
    # attendee.click_on(:first_star)
    visit ATTENDEE_RATE_SLIDE
    find("#rating_input_3_to_global_evaluation").click
 
    # inspect database 
    expect(db_rating).to be 3

  end 
  
  it 'should save a rating of 4 when attendee clicks on first star' do
    
    # attendee.click_on(:first_star)
    visit ATTENDEE_RATE_SLIDE
    find("#rating_input_4_to_global_evaluation").click
    
    # inspect database    
    expect(db_rating).to be 4

  end 

  it 'should save a rating of 5 when attendee clicks on first star' do
    
    # attendee.click_on(:first_star)
    visit ATTENDEE_RATE_SLIDE
    find("#rating_input_5_to_global_evaluation").click
 
    # inspect database 
    expect(db_rating).to be 5

  end 

  after(:each) do
    $db.execute_sql("delete from polls") 
  end   

end

# ---- HELPER

def db_rating
  $db.execute_sql("select * from polls")[0]["response"].to_i
end

  
