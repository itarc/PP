require_relative '../controllers/slideshow.rb'

require 'rack/test'

class GlobalEvaluation
	
  def add_note(note, user_id)
    $db.execute_sql("insert into polls values ('#{Time.now.to_f}', '#{user_id}', 'global_evaluation', #{note})")
  end
  
  def notes
   $db.execute_sql("select distinct on (user_id) response from polls where question_id = 'global_evaluation' order by user_id, timestamp desc").values.map{ |note| note[0].to_i }
  end
  
  def global_evaluation
    return nil if notes == []
    ( notes.reduce(:+) / notes.size.to_f ).round(2)
  end
  
end

if __FILE__ == $0 then
	

end