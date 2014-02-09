require 'rspec'
require 'capybara/rspec'

require_relative '../../controllers/slideshow.rb'
require_relative 'spec.controller.rb'

Capybara.app = Sinatra::Application.new

set :logging, false

TEACHER_SLIDESHOW_2_QUESTIONS_2_SLIDES = '/teacher/2_questions_2_slides'
ATTENDEE_SLIDESHOW_2_QUESTIONS_2_SLIDES = '/2_questions_2_slides'

describe 'Poll with TWO QUESTIONS on TWO Different slides with only ONE ATTENDEE', :type => :feature, :js => true do
  
  before(:each) do
    $db.execute_sql("delete from polls") 
  end
  
  it 'should display 0% when attendee does not answer' do

    # teacher.go_to(:poll_slide)
     visit TEACHER_SLIDESHOW_2_QUESTIONS_2_SLIDES
     
    # teacher.go_to(:poll_result_slide_1)
    find(:css, 'div.presentation').native.send_key(:arrow_right)
     
    # expect(teacher.current_slide.reponse_systeme).to have_content "Oui (0%)"
    # expect(teacher.current_slide.reponse_systeme).to have_content "Non (0%)"
 
    within ("#reponse_systeme") do # To remove when slide will have only one question
      expect(page).to have_content "Oui (0%)"
      expect(page).to have_content "Non (0%)"
    end

    # teacher.go_to(:poll_result_slide_2)
    find(:css, 'div.presentation').native.send_key(:arrow_right)
    find(:css, 'div.presentation').native.send_key(:arrow_right)

    # expect(teacher.current_slide.reponse_reparti).to have_content "Oui (0%)"
    # expect(teacher.current_slide.reponse_reparti).to have_content "Non (0%)"   
    within ("#reponse_reparti") do # To remove when slide will have only one question
      expect(page).to have_content "Oui (0%)"
      expect(page).to have_content "Non (0%)"
    end    
    
  end
  
  it 'should display 100% when attendee clicks only one time for each question' do

    # teacher.go_to(:poll_slide_1)
     visit TEACHER_SLIDESHOW_2_QUESTIONS_2_SLIDES
    
    # attendee.question_systeme.click_on("Oui")
    visit ATTENDEE_SLIDESHOW_2_QUESTIONS_2_SLIDES   
    within ("#question_systeme") do
      find("label", :text => "Oui").click
    end  
    
    # teacher.go_to(:poll_result_slide_1)
    visit TEACHER_SLIDESHOW_2_QUESTIONS_2_SLIDES
    find(:css, 'div.presentation').native.send_key(:arrow_right) 

    # expect(teacher.current_slide.reponse_systeme).to have_content "Oui (100%)"
    # expect(teacher.current_slide.reponse_systeme).to have_content "Non (0%)"
    within ("#reponse_systeme") do
      expect(page).to have_content "Oui (100%)"
      expect(page).to have_content "Non (0%)"
    end
    
    # teacher.go_to(:poll_slide_2)
     visit TEACHER_SLIDESHOW_2_QUESTIONS_2_SLIDES
    find(:css, 'div.presentation').native.send_key(:arrow_right)
    find(:css, 'div.presentation').native.send_key(:arrow_right)
     
    # attendee.question_reparti.click_on("Oui")
    visit ATTENDEE_SLIDESHOW_2_QUESTIONS_2_SLIDES   
    find(:css, 'div.presentation').native.send_key(:space)  
    within ("#question_reparti") do
      find("label", :text => "Oui").click
    end
    
    # teacher.go_to(:poll_result_slide_2)
    visit TEACHER_SLIDESHOW_2_QUESTIONS_2_SLIDES
    find(:css, 'div.presentation').native.send_key(:arrow_right)     
    find(:css, 'div.presentation').native.send_key(:arrow_right)     
    find(:css, 'div.presentation').native.send_key(:arrow_right)     

    # expect(teacher.current_slide.reponse_reparti).to have_content "Oui (100%)"
    # expect(teacher.current_slide.reponse_reparti).to have_content "Non (0%)" 
    within ("#reponse_reparti") do
      expect(page).to have_content "Oui (100%)"
      expect(page).to have_content "Non (0%)"
    end
    
    # REVISITING TO BE SURE THE RESULT DOES NOT CHANGE

    # teacher.go_to(:poll_result_slide_1)
    visit TEACHER_SLIDESHOW_2_QUESTIONS_2_SLIDES
    find(:css, 'div.presentation').native.send_key(:arrow_right)
    
    # expect(teacher.current_slide.reponse_systeme).to have_content "Oui (100%)"
    # expect(teacher.current_slide.reponse_systeme).to have_content "Non (0%)"
    within ("#reponse_systeme") do
      expect(page).to have_content "Oui (100%)"
      expect(page).to have_content "Non (0%)"
    end
    
    # teacher.go_to(:poll_result_slide_2)
    visit TEACHER_SLIDESHOW_2_QUESTIONS_2_SLIDES
    find(:css, 'div.presentation').native.send_key(:arrow_right)     
    find(:css, 'div.presentation').native.send_key(:arrow_right)     
    find(:css, 'div.presentation').native.send_key(:arrow_right)     

    # expect(teacher.current_slide.reponse_reparti).to have_content "Oui (100%)"
    # expect(teacher.current_slide.reponse_reparti).to have_content "Non (0%)" 
    within ("#reponse_reparti") do
      expect(page).to have_content "Oui (100%)"
      expect(page).to have_content "Non (0%)"
    end     
    
  end

  after(:each) do
    $db.execute_sql("delete from polls") 
  end 
  
end

