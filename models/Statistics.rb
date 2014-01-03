require_relative '../controllers/slideshow.rb'

require 'rack/test'

class SlideStat
	
  attr_accessor :slide_id	
	
  def initialize (slide_id)
    @slide_id = slide_id
  end	
  
  def add_grade(grade, user_id)
    $db.execute_sql("insert into polls values ('#{Time.now.to_f}', '#{user_id}', '#{slide_id}', #{grade})")
  end
  
  def grades
   $db.execute_sql("select distinct on (user_id) response from polls where question_id = '#{slide_id}' order by user_id, timestamp desc").values.map{ |grade| grade[0].to_i }
  end
  
  def rating
    return nil if grades == []
    ( grades.reduce(:+) / grades.size.to_f ).round(2)
  end
  
end

class UserStat

  attr_accessor :user_id
	
  def initialize(user_id)
    @user_id = user_id
    @profiles = []
    @profile_map = {}
    @slide_grades = []
  end
  
  def add_grade(grade)
    $db.execute_sql("insert into polls values ('#{Time.now.to_f}', '#{@user_id}', 'evaluation', '#{grade}')")
  end
  
  def grades
    $db.execute_sql("select distinct on(question_id) response from polls where user_id = '#{@user_id}' and question_id like '%evaluation' order by question_id, timestamp desc").values.flatten
  end
  
  def profile
    @profiles = []
    questions.each { |question_id| @profiles << [question_id, response_to(question_id)] }	  
    @profiles
  end
  
  def questions
    $db.execute_sql("select distinct question_id from polls where question_id like '%question%'").values.flatten
  end  
  
  def add_question(question)
    $db.execute_sql("insert into polls values ('0', '0', '#{question}', '0')")
  end  
  
  def response_to(question)
    $db.execute_sql("select response from polls where question_id = '#{question}' and user_id = '#{@user_id}'").values.flatten[0]
  end 

  def add_response(question, response)
    $db.execute_sql("insert into polls values ('0', '#{@user_id}', '#{question}', '#{response}')")
  end  
  
  $slide_user_stats = []
  def slide_user_stats
    $slide_user_stats
  end
  
  def add_slide_user_stat(slide_user_stat)
    $slide_user_stats << slide_user_stat
  end  
  
  def add_map(map)
    @profile_map = map
  end
  
  def mapped_profile
    profile.map { |sub_profile|  @profile_map[sub_profile] || sub_profile }
  end
  
  def slide_grades
    $db.execute_sql("select distinct on(question_id) question_id, response from polls where user_id = '#{@user_id}' and question_id like '%evaluation' order by question_id, timestamp desc").values
  end
  
  def add_slide_grade(slide_grade)
    $db.execute_sql("insert into polls values ('#{Time.now.to_f}', '#{@user_id}', '#{slide_grade[0]}', '#{slide_grade[1]}')")
  end
  
  def UserStat.find_all
    user_stats_values = $db.execute_sql("select user_id from polls").values
    all_user_stats = []
    user_stats_values.each do |values|
	all_user_stats << UserStat.new(values[0])
    end
    all_user_stats
  end
  
  def save
    $db.execute_sql("insert into polls values ('#{Time.now.to_f}', '#{@user_id}', '', '')")
  end
  
end

class PresentationStats
	
  attr_accessor :user_stats

  def initialize
    @user_stats = []
    UserStat.find_all.each do |user_stat|
      add_user_stat(user_stat)
    end
  end
  
  def add_slide(name)
    $db.execute_sql("insert into polls values ('', '', '#{name}', '1')")
  end
  
  def slides
    $db.execute_sql("select question_id from polls").values.flatten.uniq
  end
  
  def rating_slides
    slides.select { |slide_name| slide_name if /.+_evaluation/ =~ slide_name}
  end

  def add_user_stat(new_user_stat)
    @user_stats.each do |user_stat| 
	    return if user_stat.user_id == new_user_stat.user_id 
    end
    @user_stats << new_user_stat
  end

end


