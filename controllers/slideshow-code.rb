require 'json'

post '/code_run_result' do
  response.headers['Access-Control-Allow-Origin'] = '*'  
  code = request.env["rack.input"].read
  run_ruby(code.force_encoding("UTF-8"))
end

post '/code_save_execution_context/*' do 
  json_string = request.env["rack.input"].read
  execution_context = JSON.parse(json_string)
  type = execution_context["type"]
  code = execution_context["code"]
  result = execution_context["code_output"]
  RunTimeEvent.new(user_session_id, type, slide_index, code, result).save
end

post '/code_save_blackboard_execution_context/*' do
  response.headers['Access-Control-Allow-Origin'] = '*'   
  json_string = request.env["rack.input"].read
  execution_context = JSON.parse(json_string)
  type = execution_context["type"]
  code = execution_context["code"]
  result = execution_context["code_output"]
  RunTimeEvent.new($blackboard_session_id, type, slide_index, code, result).save
end

get '/code_last_execution/*' do
  last_execution = RunTimeEvent.find_last_user_execution_on_slide(user_session_id, slide_index)
  return JSON.generate({}) if last_execution == nil
  last_execution.to_json_string
end

get '/code_attendees_last_send/*' do
  response.headers['Access-Control-Allow-Origin'] = '*' 
  last_send = RunTimeEvent.find_attendees_last_send_on_slide(user_session_id, slide_index)
  return  JSON.generate({}) if last_send == nil
  last_send.to_json_string  
end

get '/code_get_last_send_to_blackboard/*' do
  response.headers['Access-Control-Allow-Origin'] = '*'    
  last_teacher_run = RunTimeEvent.find_last_send_to_blackboard(slide_index)
  return JSON.generate({}) if last_teacher_run == nil
  last_teacher_run.to_json_string  
end