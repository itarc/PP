#encoding:UTF-8

require 'sinatra'

set :public_folder, File.dirname(__FILE__) + '/' + 'view_fixtures'

$teacher_current_slide = nil
$poll_rate_1 = 100
$poll_rate_2 = 0

post '/teacher_current_slide' do
  $teacher_current_slide = params[:index]
end

get '/teacher_current_slide' do
  $teacher_current_slide
end

get '/poll_rate_1' do
  $poll_rate_1.to_s
end

get '/poll_rate_2' do
  $poll_rate_2.to_s
end

post '/poll_radio_1' do
  $poll_rate_1 = ( 1 / 1 ) * 100
  $poll_rate_2 = 0
end

post '/poll_radio_2' do
  $poll_rate_1 = 0
  $poll_rate_2 = ( 1 / 1 ) * 100
end
