# CURRENT SLIDE

get '/teacher_current_slide' do
  response.headers['Access-Control-Allow-Origin'] = '*'  
  current_slide_id
end

post '/teacher_current_slide' do
  update_current_slide_id params[:index] + ';' + params[:ide_displayed] 
end