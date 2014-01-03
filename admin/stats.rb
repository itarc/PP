require "../models/Statistics"

presentation_stats = PresentationStats.new
presentation_stats.profile_response_map = ({
["question_1", "1"] =>  'cloud', 
["question_1", "2"] =>  'non_cloud', 
["question_2", "3"] =>  'informaticien', 
["question_2", "4"] =>  'non_informaticien'}
)

presentation_stats.user_stats.each do |user_stat|
  puts "---"
  p user_stat.user_id
  p user_stat.profile
  p user_stat.global_user_rating
  p user_stat.slide_ratings.map {|slide_rating| [slide_rating.slide_id, slide_rating.user_rating(user_stat.user_id) ]}
end

#~ presentation_stats.slide_stats.each do |slide_stat|
  #~ p slide_stat.slide_id
  #~ p slide_stat.user_ratings
  #~ p slide_stat.average_rating
#~ end

#~ presentation_stats.profiles.each do |profile|
  #~ p profile.id
  #~ p profile.slide_ratings
#~ end
