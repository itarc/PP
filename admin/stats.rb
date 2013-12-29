require "../models/Statistics"

PresentationStats.new.users.each do |user|
  puts "--" + user
  p UserStat.new(user).grades
end

PresentationStats.new.rating_slides.each do |slide_id|
  puts "--" + slide_id
  puts ">notes : " + SlideStat.new(slide_id).grades.to_s
  puts ">moyenne :" + SlideStat.new(slide_id).rating.to_s
end

