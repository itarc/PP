# POLLS

get '/poll_response_*_rate_to_*' do
  response.headers['Access-Control-Allow-Origin'] = '*' 	
  PollQuestion.new(question_id).rate_for(answer).to_s
end

post '/poll_response_*_to_*' do
  response.headers['Access-Control-Allow-Origin'] = '*' 	
  PollQuestion.new(question_id).add_a_choice(user_session_id, answer)
end

post '/rating_input_*_to_*' do
  response.headers['Access-Control-Allow-Origin'] = '*' 	
  PollQuestion.new(question_id).add_a_choice(user_session_id, answer)
end

post '/select_input_*_to_*' do
  response.headers['Access-Control-Allow-Origin'] = '*' 	
  PollQuestion.new(question_id).add_a_choice(user_session_id, answer)
end