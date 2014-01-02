require "../models/Statistics"

PresentationStats.new.users.each do |user|
  puts "-- user : " + user
  user_stat = UserStat.new(user)
  
  user_stat.add_map ({
  ["question_1", "1"] =>  'cloud', 
  ["question_1", "2"] =>  'non_cloud', 
  ["question_2", "3"] =>  'informaticien', 
  ["question_2", "4"] =>  'non_informaticien'
  })

  p user_stat.mapped_profile
  p user_stat.slide_grades
end

PresentationStats.new.rating_slides.each do |slide_id|
  puts "--" + slide_id
  puts ">notes : " + SlideStat.new(slide_id).grades.to_s
  puts ">moyenne :" + SlideStat.new(slide_id).rating.to_s
end

