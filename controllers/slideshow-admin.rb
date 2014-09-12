# ADMIN

get '/admin/flip' do
  send_file "views/flip_page.html"
end

get '/admin/flip/*' do
  response.headers['Access-Control-Allow-Origin'] = '*'	
  Flip.find(params[:splat][0]).value
end

post '/admin/flip/*' do
  Flip.new(params[:splat][0], params[:value]).save
end