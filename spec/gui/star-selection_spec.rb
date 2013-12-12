require 'rspec'
require 'capybara/rspec'

require_relative '../../controllers/slideshow.rb'
require_relative 'spec.controller.rb'

Capybara.app = Sinatra::Application.new

set :logging, false

ATTENDEE_SELECT_SLIDE = '/star_selection'

describe 'Star Rating with ONE attendee', :type => :feature, :js => true do
  
  before(:each) do
    $db.execute_sql("delete from polls") 
  end
  
  it 'should select/unselect proposition when attendee clicks on star' do
    
    # attendee.click_on(:first_star)
    visit ATTENDEE_SELECT_SLIDE
    find("#select_input_1_to_proposition").click

    expect(db_rating).to be 1

  end  

  after(:each) do
    $db.execute_sql("delete from polls") 
  end

end

# ---- HELPER

def db_rating
  $db.execute_sql("select * from polls")[0]["response"].to_i
end

  
