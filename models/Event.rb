class Event
	
  attr_accessor  :timestamp, :user_id, :question_id, :response
	
  def initialize(timestamp, user_id, question_id, response)
    @timestamp = timestamp
    @user_id = user_id
    @question_id = question_id
    @response = response
  end
  
  def to_s
    [@timestamp, @user_id, @question_id, @response]
  end
  
end