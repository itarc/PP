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

