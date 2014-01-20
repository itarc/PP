require_relative '../db/Accesseur'  
$db = Accesseur.new

USER_ID = 1
ANSWER = 3

class PollQuestion
	
  def initialize(question_id)
    @question_id = question_id
  end

  def possible_responses
    $db.execute_sql("select distinct response from polls where question_id='#{@question_id}'").values.map { |value| value[0] }.sort
  end
  
  def users_for_each_answer
    rows = $db.execute_sql("select distinct on (user_id) * from polls where question_id='#{@question_id}' order by user_id, timestamp desc").values
    return {} if rows == []
    users_for_each_answer = {}
    rows.each do |row|
      if users_for_each_answer[ row[ANSWER] ] == nil then
        users_for_each_answer[ row[ANSWER] ] = [ row[USER_ID] ]
      else
	users_for_each_answer[ row[ANSWER] ] += [ row[USER_ID] ]
      end
    end
    return users_for_each_answer
  end
  
  def total_number_of_users
    return 0 if users_for_each_answer == {}
    users_for_each_answer.values.flatten.size
  end
  
  def total_number_of_users_for(response)
    return 0 if users_for_each_answer[response.to_s] == nil
    return users_for_each_answer[response.to_s].size
  end  
  
  def rate_for(response)
    return 0 if total_number_of_users == 0
    ((total_number_of_users_for(response).to_f / total_number_of_users.to_f) * 100.0).round
  end
  
  def add_a_choice(user_id, answer)
    $db.execute_sql("
    insert into polls values ('#{timestamp}', '#{user_id}', '#{@question_id}', '#{answer}')
    ")    
  end
  
  def rates
    rates = {}
    possible_responses.each do |response|
      rate = rate_for(response)
      rates[response] = rate
    end
    {@question_id => rates }
  end

end

# ---- HELPERS

def timestamp
  Time.now.to_f
end
