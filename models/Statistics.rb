require_relative '../controllers/slideshow.rb'

require 'rack/test'

class SlideStats
	
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

class PresentationStats
  
  def add_slide(name)
    $db.execute_sql("insert into polls values ('', '', '#{name}', '1')")
  end
  
  def slides
    $db.execute_sql("select question_id from polls").values.flatten.uniq
  end
  
  def rating_slides
    slides.select { |slide_name| slide_name if /.+_evaluation/ =~ slide_name}
  end

  def add_user(user_id)
    $db.execute_sql("insert into polls values ('0', '#{user_id}', '0', '0')")
  end	
 
  def users
    $db.execute_sql("select distinct user_id from polls order by user_id asc").values.flatten
  end

end

