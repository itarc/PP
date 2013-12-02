#encoding:UTF-8

require 'sinatra'

set :public_folder, 'views'
set :logging, false

set :bind, '0.0.0.0'

$teacher_current_slide = nil
$user_id = 0

require_relative '../models/Poll'

enable :sessions; set :session_secret, 'secret'

require_relative '../db/Accesseur'  
$db = Accesseur.new

# ---- HTTP METHODS

get '/' do
	
  session[:user_id] ||= next_id
	
  redirect "slideshow-attendee.html"
  
end

get '/2_questions_poll' do
	
  redirect "2_questions_poll-attendee.html"
  
end

get '/star_rating' do
	
  redirect "star_rating-attendee.html"
  
end

get '/star_selection' do
	
  redirect "star_selection-attendee.html"
  
end

get '/teacher' do
	
  redirect "slideshow-teacher.html"

end

get '/teacher/2_questions_poll' do
	
  redirect "2_questions_poll-teacher.html"

end

post '/teacher_current_slide' do
	
  $teacher_current_slide = params[:index]
  
end

get '/teacher_current_slide' do
	
  $teacher_current_slide
  
end

get '/poll_response_*_rate_to_*' do
  
  PollQuestion.new(question_id).rate_for(answer).to_s

end

post '/poll_response_*_to_*' do

  PollQuestion.new(question_id).add_a_choice(user_id, answer)
  
end

post '/rating_input_*_to_*' do

  PollQuestion.new(question_id).add_a_choice(user_id, answer)
  
end

post '/select_input_*_to_*' do

  PollQuestion.new(question_id).add_a_choice(user_id, answer)
  
end

# ---- HELPERS

def question_id
  params[:splat][1]
end

def answer
  params[:splat][0].to_i 
end

def user_id
  session[:user_id]  
end

def next_id
  $user_id += 1
end
