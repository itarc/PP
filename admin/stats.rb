require "../models/Statistics"

PresentationStats.new.users.each do |user|
  puts "--" + user
  user_stat = UserStat.new(user)
  p user_stat.profile.map { |pr| 
  case pr 
  when ["question_1", "1"] 
  'cloud' 	
  when ["question_1", "2"] 
  'non_cloud' 	  
  when ["question_2", "3"] 
  'informaticien' 
  when ["question_2", "4"] 
  'non_informaticien'
  end
  }
  p UserStat.new(user).grades
end

PresentationStats.new.rating_slides.each do |slide_id|
  puts "--" + slide_id
  puts ">notes : " + SlideStat.new(slide_id).grades.to_s
  puts ">moyenne :" + SlideStat.new(slide_id).rating.to_s
end

