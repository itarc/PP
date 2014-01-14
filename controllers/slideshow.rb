require 'sinatra'

set :public_folder, 'views'
set :logging, false

set :bind, '0.0.0.0'

enable :sessions; set :session_secret, 'secret'

require_relative 'slideshow_helper'

get '/' do
  session[:user_id] ||= next_id
  redirect "slideshow-attendee.html"
end

get '/teacher-x1973' do
  redirect "slideshow-teacher.1973x.html"
end

post '/teacher_current_slide' do
  update_current_slide_id params[:index]
end

get '/teacher_current_slide' do
  current_slide_id
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

post '/code_execution_result' do
  run_ruby(params[:code] || "")
end

