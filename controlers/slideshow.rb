require 'sinatra'

set :public_folder, 'views'

$teacher_current_slide = nil

get '/' do
  redirect "slideshow.html"
end

post '/teacher_current_slide' do
  $teacher_current_slide = params[:index]
end

get '/teacher_current_slide' do
  $teacher_current_slide
end

