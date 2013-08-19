#encoding:UTF-8

require 'sinatra'

set :public_folder, 'views'
set :logging, false

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

def resume_poll
  
  number_of_radios = 4
  $poll_rate = [0] * (number_of_radios + 1)
  
end

resume_poll

post '/resume_poll' do
  
  resume_poll
  
end

get '/poll_rate_*' do

  index = params[:splat][0].to_i
  $poll_rate[index].to_s
  
end

post '/poll_radio_*' do

  resume_poll

  index = params[:splat][0].to_i
  $poll_rate[index] = ( 1 / 1 ) *  100
  #~ add return if post call is synchronous
  
end
