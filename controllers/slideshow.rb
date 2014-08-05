require 'sinatra'

set :public_folder, 'public'
set :views, 'views'
set :logging, false

set :bind, '0.0.0.0'

enable :sessions; set :session_secret, 'secret'

require_relative 'slideshow_helper'

require_relative '../views/presentation/content'

# ---------
# GETs
# ---------

get '/' do
  session[:user_id] ||= next_user_id
  erb :slideshow_attendee  
end

get '/blackboard' do
  erb :slideshow_blackboard
end

get '/blackboard_hangout.xml' do
  content_type 'text/xml'
  erb :slideshow_blackboard_hangout
end

get '/teacher-x1973' do
  session[:user_id] = '0'
  erb :slideshow_teacher
end

get '/teacher_current_slide' do
  response.headers['Access-Control-Allow-Origin'] = '*'  
  current_slide_id
end

get '/poll_response_*_rate_to_*' do
  PollQuestion.new(question_id).rate_for(answer).to_s
end

get '/code_last_execution/*' do
  last_execution = RunTimeEvent.find_last_user_execution_on_slide(session[:user_id], slide_index)
  return "" if last_execution == nil
  last_execution.user + $SEPARATOR + last_execution.code_input
end

get '/code_attendees_last_send/*' do
  response.headers['Access-Control-Allow-Origin'] = '*' 
  last_send = RunTimeEvent.find_attendees_last_send_on_slide(session[:user_id], slide_index)
  return "" if last_send == nil
  last_send.user + $SEPARATOR + last_send.code_input
end

get '/code_get_last_send_to_blackboard/*' do
  response.headers['Access-Control-Allow-Origin'] = '*'    
  last_teacher_run = RunTimeEvent.find_last_send_to_blackboard(slide_index)
  return "" if last_teacher_run == nil
  last_teacher_run.user + $SEPARATOR + last_teacher_run.code_input  
end

get '/session_id' do
  response.headers['Access-Control-Allow-Origin'] = '*'  
  session[:user_id]
end

# ---------
# POSTs
# ---------

post '/teacher_current_slide' do
  update_current_slide_id params[:index] + ';' + params[:ide_displayed] 
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

post '/code_run_result/*' do
  code = request.env["rack.input"].read
  run_ruby("run", code.force_encoding("UTF-8"), user_id, slide_index)
end

post '/code_run_result_blackboard/*' do
  response.headers['Access-Control-Allow-Origin'] = '*'    
  code = request.env["rack.input"].read
  run_ruby("run", code.force_encoding("UTF-8"), 'blackboard', slide_index)
end

post '/code_send_result/*' do
  code = request.env["rack.input"].read
  run_ruby("send", code.force_encoding("UTF-8"), user_id, slide_index)
end

post '/session_id/attendee_name' do
  session[:user_id] = session[:user_id].split('_')[0] + '_' + params[:attendee_name]
end