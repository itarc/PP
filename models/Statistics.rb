require_relative '../controllers/slideshow.rb'

class PresentationStats
	
  attr_accessor :profile_response_map

  def initialize
    @user_stats = []
    @profile_response_map = {}
  end
  
  def user_stats
    UserStat.find_all.each { |user_stat| add_user_stat(user_stat) }
    @user_stats
  end

  def add_user_stat(new_user_stat)
    @user_stats.each do |user_stat| 
	    return if user_stat.user_id == new_user_stat.user_id 
    end
    new_user_stat.user_profile.add_response_map(profile_response_map)
    @user_stats << new_user_stat
  end

end


class UserStat

  attr_accessor :user_id, :user_profile, :slide_stats
	
  def initialize(user_id)
    @user_id = user_id
    @user_profile = UserProfile.new(@user_id)
    @response_map = {}
    @slide_ratings = []
  end
  
  def slide_ratings
    SlideRating.find_all.each do |slide_rating| add_slide_rating(slide_rating) end
    @slide_ratings
  end
  
  def global_user_rating
    GlobalRating.find.user_ratings[@user_id]
  end
  
  def add_slide_rating(slide_rating)
    @slide_ratings << slide_rating
  end
  
  def profile_responses
    @user_profile.questions.map { |question_id| [question_id, @user_profile.response_to(question_id)] }	  
  end
  
  def profile
    profile_responses.map { |profile_response| @user_profile.response_map[profile_response] || profile_response}
  end
  
  def UserStat.find_all
    $db.execute_sql("select user_id from polls order by user_id").values.map {|values| UserStat.new(values[0]) }
  end
  
  def save
    $db.execute_sql("insert into polls values ('#{Time.now.to_f}', '#{@user_id}', '', '')")
  end
  
end

class GlobalRating
	
  attr_accessor :user_ratings
  
  @@slide_id = "global_evaluation"
	
  def initialize(user_ratings)
    @user_ratings = user_ratings
  end
  
  def save
    @user_ratings.keys.each do |user_id|
      $db.execute_sql("insert into polls values ('#{Time.now.to_f}', '#{user_id}', '#{@@slide_id}', '#{@user_ratings[user_id]}')")
    end
  end
	
  def GlobalRating.find
    ratings = {}
    $db.execute_sql("select user_id, response from polls where question_id = '#{@@slide_id}'").to_a.each do |rating|
      ratings[rating["user_id"]] = rating["response"].to_i
     end
     GlobalRating.new(ratings)
  end
  
end


class SlideRating
	
  attr_accessor :slide_id, :user_ratings	
	
  def initialize (slide_id, user_ratings)
    @slide_id = slide_id
    @user_ratings = user_ratings
  end
  
  def SlideRating.find_all
    $db.execute_sql("select distinct question_id from polls where question_id like 'slide_%_evaluation' order by question_id").to_a.map do |question|
      ratings = {}
      $db.execute_sql("select user_id, response from polls where question_id = '#{question["question_id"]}'").to_a.each do |rating|
	ratings[rating["user_id"]] = rating["response"].to_i
      end
      SlideRating.new(question["question_id"], ratings)
    end
  end
  
  def save
    @user_ratings.keys.each do |user_id|
      $db.execute_sql("insert into polls values ('#{Time.now.to_f}', '#{user_id}', '#{@slide_id}', '#{@user_ratings[user_id]}')")
    end
  end
  
  def user_rating(user_id)	  
    @user_ratings[user_id]
  end
  
  def add_user_rate(user_id, user_rate)
    @user_ratings[user_id] = user_rate
  end
  
end


class UserProfile
	
  def initialize(user_id)
    @user_id = user_id
    @response_map = {}
  end
  
  def add_response(question, response)
    $db.execute_sql("insert into polls values ('0', '#{@user_id}', '#{question}', '#{response}')")
  end
  
  def add_question(question)
    $db.execute_sql("insert into polls values ('0', '0', '#{question}', '0')")
  end  
  
  def add_response_map(map)
    @response_map = map
  end  
  
  def questions
    $db.execute_sql("select distinct question_id from polls where question_id like '%question%'").values.flatten
  end  
  
  def response_to(question)
    $db.execute_sql("select response from polls where question_id = '#{question}' and user_id = '#{@user_id}'").values.flatten[0]
  end
  
  def response_map
    @response_map
  end

end