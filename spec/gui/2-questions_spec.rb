require 'rspec'
require 'capybara/rspec'

require_relative '../../controllers/slideshow.rb'
require_relative 'spec.controller.rb'

Capybara.app = Sinatra::Application.new

set :logging, false

TEACHER_SLIDESHOW_2 = '/teacher/2_questions_poll'
ATTENDEE_SLIDESHOW_2 = '/2_questions_poll'

describe 'Poll with TWO QUESTIONS and only ONE ATTENDEE', :type => :feature, :js => true do
  
  before(:each) do
    $db.execute_sql("delete from polls") 
  end
  
  it 'should display 0% when attendee does not answer' do

    # teacher.go_to(:poll_slide)
     visit TEACHER_SLIDESHOW_2
     
    # teacher.go_to(:poll_result_slide)
    find(:css, 'div.presentation').native.send_key(:arrow_right)
     
    # expect(teacher.current_slide.reponse_systeme).to have_content "Oui (0%)"
    # expect(teacher.current_slide.reponse_systeme).to have_content "Non (0%)"
    # expect(teacher.current_slide.reponse_reparti).to have_content "Oui (0%)"
    # expect(teacher.current_slide.reponse_reparti).to have_content "Non (0%)"    
    within ("#reponse_systeme") do # To remove when slide will have only one question
      expect(page).to have_content "Oui (0%)"
      expect(page).to have_content "Non (0%)"
    end
    
    within ("#reponse_reparti") do # To remove when slide will have only one question
      expect(page).to have_content "Oui (0%)"
      expect(page).to have_content "Non (0%)"
    end    
    
  end
  
  it 'should display 100% when attendee clicks only one time for each question' do

    # teacher.go_to(:poll_slide)
     visit TEACHER_SLIDESHOW_2
    
    # attendee.question_systeme.click_on("Oui")
    # attendee.question_reparti.click_on("Oui")
    visit ATTENDEE_SLIDESHOW_2   
    within ("#question_systeme") do
      find("label", :text => "Oui").click
    end    
    within ("#question_reparti") do
      find("label", :text => "Oui").click
    end      

    # teacher.go_to(:poll_result_slide)
    visit TEACHER_SLIDESHOW_2
    find(:css, 'div.presentation').native.send_key(:arrow_right)      
     
    # expect(teacher.current_slide.reponse_systeme).to have_content "Oui (100%)"
    # expect(teacher.current_slide.reponse_systeme).to have_content "Non (0%)"
    # expect(teacher.current_slide.reponse_reparti).to have_content "Oui (100%)"
    # expect(teacher.current_slide.reponse_reparti).to have_content "Non (0%)" 
    within ("#reponse_systeme") do # To remove when slide will have only one question
      expect(page).to have_content "Oui (100%)"
      expect(page).to have_content "Non (0%)"
    end
    
    within ("#reponse_reparti") do # To remove when slide will have only one question
      expect(page).to have_content "Oui (100%)"
      expect(page).to have_content "Non (0%)"
    end    
    
  end

  after(:each) do
    $db.execute_sql("delete from polls") 
  end   
  
end

