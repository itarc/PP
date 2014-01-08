#encoding:UTF-8

require 'sinatra'

set :public_folder, 'views'
set :logging, false

set :bind, '0.0.0.0'

require_relative '../models/Poll'
require_relative '../models/RunTime'
require_relative '../models/Statistics'

enable :sessions; set :session_secret, 'secret'

require_relative '../db/Accesseur'  
$db = Accesseur.new

# ---- HTTP METHODS

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

get '/admin' do
	
  last_user_id = "LAST_USER_ID</br>"
  last_user_id << $db.execute_sql("select identifiant from compteur")[0]["identifiant"]
  last_user_id << "</br>"

  polls = "POLLS</br>"
  PollQuestion.find_all.each do |tuple|
    line = ''
    tuple.each do | value|
      line << value + ", "
    end
    polls << line + "</br>"
  end
  
  global_evaluation = "GLOBAL_EVALUATION</br>" + GlobalEvaluation.new.global_evaluation.to_s
  
  last_user_id + polls + global_evaluation
	
end

get '/code_execution_result' do

  run_ruby(params[:code] || "")

end

# ---- HELPERS

def question_id
  params[:splat][1]
end

def answer
  params[:splat][0]
end

def user_id
  session[:user_id]  
end

def next_id
  $db.execute_sql("update compteur set identifiant = identifiant + 1")
  return $db.execute_sql("select identifiant from compteur").to_a[0]['identifiant'].to_i
end

def current_slide_id
  $db.execute_sql("select current_slide_id from teacher_current_slide").to_a[0]['current_slide_id'].to_s
end

def update_current_slide_id(current_slide_id)
   $db.execute_sql("update teacher_current_slide set current_slide_id = '#{current_slide_id}'")
end
