require "../models/Statistics"

p PresentationStats.new.users

PresentationStats.new.rating_slides.each do |slide_id|
  puts "--" + slide_id
  puts ">notes : " + SlideStats.new(slide_id).grades.to_s
  puts ">moyenne :" + SlideStats.new(slide_id).rating.to_s
end

