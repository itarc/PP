require 'json'

post '/code_save_execution_context/*' do
  json_string = request.env["rack.input"].read
  execution_context = JSON.parse(json_string)
  type = execution_context["type"]
  code = execution_context["code"]
  result = execution_context["code_output"]
  RunTimeEvent.new(user_session_id, type, slide_index, code, result).save
end

get '/code_last_execution/*' do
  last_execution = RunTimeEvent.find_last_user_execution_on_slide(session[:user_session_id], slide_index)
  return JSON.generate({}) if last_execution == nil
  JSON.generate({ :type => last_execution.type, :author => user_name_of(last_execution.user), :code => last_execution.code_input, :code_output => last_execution.code_output})   
end

get '/code_attendees_last_send/*' do
  response.headers['Access-Control-Allow-Origin'] = '*' 
  last_send = RunTimeEvent.find_attendees_last_send_on_slide(session[:user_session_id], slide_index)
  return  JSON.generate({}) if last_send == nil
  JSON.generate({ :type => last_send.type, :author => user_name_of(last_send.user), :code => last_send.code_input, :code_output => last_send.code_output})     
end

get '/code_get_last_send_to_blackboard/*' do
  response.headers['Access-Control-Allow-Origin'] = '*'    
  last_teacher_run = RunTimeEvent.find_last_send_to_blackboard(slide_index)
  return  JSON.generate({}) if last_teacher_run == nil
  JSON.generate({ :type => last_teacher_run.type, :author => user_name_of(last_teacher_run.user), :code => last_teacher_run.code_input, :code_output => last_teacher_run.code_output})       
end

post '/code_run_result/*' do
  code = request.env["rack.input"].read
  run_ruby("run", code.force_encoding("UTF-8"), user_session_id, slide_index)
end

post '/code_run_result_blackboard/*' do
  response.headers['Access-Control-Allow-Origin'] = '*'    
  code = request.env["rack.input"].read
  run_ruby("run", code.force_encoding("UTF-8"), 'blackboard', slide_index)
end

post '/code_send_result/*' do
  code = request.env["rack.input"].read
  run_ruby("send", code.force_encoding("UTF-8"), user_session_id, slide_index)
end