require 'rspec'
require 'capybara/rspec'

require_relative '../../controllers/slideshow.rb'
require_relative 'spec.controller'

Capybara.app = Sinatra::Application.new

set :logging, false

TEACHER_SLIDESHOW = '/teacher/1_question_poll'
ATTENDEE_SLIDESHOW = '/1_question_poll'

describe 'Poll with ONE QUESTION and only ONE ATTENDEE', :type => :feature, :js => true do
  
  before(:each) do
    $db.execute_sql("delete from polls") 
    $db.execute_sql("delete from teacher_current_slide")        
  end
  
  it 'should display 0% when attendee does not answer' do

    #~ go_to(:fisrt_slide)
    visit TEACHER_SLIDESHOW
    
    #~ go_to(:next_slide)
    find(:css, 'div.presentation').native.send_key(:arrow_right)

    # expect(teacher.current_slide).to have_content "Oui (0%)"
    # expect(teacher.current_slide).to have_content "Non (0%)"
    within ("#reponse_systeme") do
      expect(page).to have_content "Oui (0%)"
      expect(page).to have_content "Non (0%)"
    end
    
  end
  
  it 'should display 100% when attendee clicks only one time' do

    # teacher.go_to(:poll_slide)
     visit TEACHER_SLIDESHOW
    
    # attendee.click_on("Oui")
    visit ATTENDEE_SLIDESHOW   
    within ("#question_systeme") do
      find("label", :text => "Oui").click
    end    
    
    # teacher.go_to(:poll_result_slide)
    visit TEACHER_SLIDESHOW
    find(:css, 'div.presentation').native.send_key(:arrow_right) 
     
    # expect(teacher.current_slide).to have_content "Oui (100%)"
    # expect(teacher.current_slide).to have_content "Non (0%)"
    within ("#reponse_systeme") do # To remove when slide will have only one question
      expect(page).to have_content "Oui (100%)"
      expect(page).to have_content "Non (0%)"
    end
    
  end   

  it 'should display 100% when attendee changes his answer and clicks 2 times' do

    # teacher.go_to(:poll_slide)
     visit TEACHER_SLIDESHOW
    
    # attendee.click_on("Oui")
    # attendee.click_on("Non")    
    visit ATTENDEE_SLIDESHOW
    within ("#question_systeme") do
      find("label", :text => "Oui").click
    end   
    within ("#question_systeme") do
      find("label", :text => "Non").click
    end    
    
    # teacher.go_to(:poll_result_slide)
    visit TEACHER_SLIDESHOW
    find(:css, 'div.presentation').native.send_key(:arrow_right)
     
    # expect(teacher.current_slide).to have_content "Oui (0%)"
    # expect(teacher.current_slide).to have_content "Non (100%)"
    within ("#reponse_systeme") do # To remove when slide will have only one question
      expect(page).to have_content "Oui (0%)"
      expect(page).to have_content "Non (100%)"
    end
    
  end 
  
  after(:each) do
    $db.execute_sql("delete from polls") 
    $db.execute_sql("delete from teacher_current_slide")        
  end    

end


  
