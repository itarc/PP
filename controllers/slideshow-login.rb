# LOGIN

require_relative '../views/presentation/content'

get '/' do
  session[:user_session_id] ||= next_session_id
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
  session[:user_session_id] = $teacher_session_id
  erb :slideshow_teacher
end

# SESSION ID

get '/session_id' do
  response.headers['Access-Control-Allow-Origin'] = '*'  
  session[:user_session_id]
end

get '/session_id/user_name' do
  response.headers['Access-Control-Allow-Origin'] = '*'
  user_name_of(session[:user_session_id])
end

post '/session_id/user_name' do
  session[:user_session_id] = session[:user_session_id].split('_')[0] + '_' + params[:user_name]
end