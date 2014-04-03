#encoding: utf-8

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
blackboard = '/attendee/blackboard'

get teacher_coding_presentation do
  session[:user_id] = '0'	
  redirect "coding_presentation-teacher.html"
end

get blackboard do
  session[:user_id] = '1'  
  redirect "coding_presentation-blackboard.html"
end

## -------------------------------------------------------
## SINATRA CONTROLLER (END)
## -------------------------------------------------------
  
describe 'Attendee presentation', :type => :feature, :js => true do  
	
  before(:all) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide") 
  end

  it 'should be on first slide' do

    visit teacher_coding_presentation
    
    expect(page).to have_content 'CODING EXERCISE - 1'
  
    visit blackboard
        
    expect(page).to have_content 'CODING EXERCISE - 1'   

  end
  
  it 'should be on second slide' do
    
    visit teacher_coding_presentation
    find(:css, 'div.presentation').native.send_key(:arrow_right)    
    
    expect(page).to have_content 'CODING EXERCISE - 2'
  
    visit blackboard
        
    expect(page).to have_content 'CODING EXERCISE - 2'  

  end

  it 'should be on IDE with code helper 2' do
    
    visit teacher_coding_presentation
    find(:css, 'div.presentation').native.send_key(:arrow_down)    
    
    expect(page).to have_content 'HELPER 2'
  
    visit blackboard
        
    expect(page).to have_content 'HELPER 2'       

  end
  
  it 'should be on IDE with code helper 1' do
    
    visit teacher_coding_presentation
    find(:css, 'div.presentation').native.send_key(:arrow_left)    
    
    expect(page).to have_content 'HELPER 1'
  
    visit blackboard
        
    expect(page).to have_content 'HELPER 1'       

  end  

  it 'should be back on first slide' do
    
    visit teacher_coding_presentation
    find(:css, 'div.presentation').native.send_key(:arrow_up)    
    
    expect(page).to have_content 'CODING EXERCISE - 1'
  
    visit blackboard
        
    expect(page).to have_content 'CODING EXERCISE - 1'       

  end
  
  after(:all) do
    $db.execute_sql("delete from run_events") 
    $db.execute_sql("delete from teacher_current_slide")    
  end   

end