#encoding:UTF-8

require 'sinatra'

set :public_folder, 'fixtures'
set :logging, false

get '/1_question_poll' do
	
  redirect "1_question_poll-attendee.html"
  
end

get '/2_questions_poll' do

  redirect "2_questions_poll-attendee.html"

end

get '/2_questions_2_slides' do

  redirect "2_questions_2_slides-attendee.html"

end

get '/star_rating' do

  redirect "star_rating-attendee.html"

end

get '/star_selection' do

  redirect "star_selection-attendee.html"

end

get '/teacher/1_question_poll' do
	
  redirect "1_question_poll-teacher.html"

end

get '/teacher/2_questions_poll' do

  redirect "2_questions_poll-teacher.html"

end

get '/teacher/2_questions_2_slides' do

  redirect "2_questions_2_slides-teacher.html"

end

get '/coding_slide' do

  redirect "coding_slide.html"

end


