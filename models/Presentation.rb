require 'time'

class Presentation

  attr_accessor :start_time, :end_time

  def initialize
    @events = all_events
    @start_time = first_event_time
    @end_time = last_event_time
  end

  def all_events
    all_events = $db.execute_sql("select timestamp, user_id, question_id, response from polls order by timestamp asc").values
    all_events.map { |tuple| Event.new(Time.at(tuple[0].to_f), tuple[1], tuple[2], tuple[3]) }
  end

  def duration
    (@end_time - @start_time) / 60
  end

  def users
    (@events.map { |event| event.user_id }).uniq
  end  
  
  def first_event_time
    return 0 if @events == []
    @events.first.timestamp
  end
  
  def last_event_time
    return 0 if @events == []
    @events.last.timestamp    
  end
  
  def ratings
    @events.select { |event|   /.*evaluation/ =~ event.question_id }
  end
  
  def ratings_by_user
    user_ratings = {}
    ratings.each do |event|
      user_ratings[event.user_id] = ( user_ratings[event.user_id] || [] ) + [event]
    end
    user_ratings
  end

  def ratings_by_question
    question_ratings = {}
    ratings.each do |event|
      question_ratings[event.question_id] = ( question_ratings[event.question_id] || [] ) + [event]
    end
    question_ratings
  end

  def ratings_by_question_and_user
    question_and_user_ratings = {}
    ratings.each do |event|
      question_and_user_ratings[event.question_id] = {} unless question_and_user_ratings[event.question_id]
      question_and_user_ratings[event.question_id][event.user_id] = ( question_and_user_ratings[event.question_id][event.user_id] || [] ) + [event]
    end
    question_and_user_ratings
  end

end

require_relative '../db/Accesseur'  
$db = Accesseur.new
require 'test/unit'

class TestPresentation_duration < Test::Unit::TestCase
	
  def setup
    $db.execute_sql("delete from polls")	  
    @start_time = Time.parse('2014-01-13 14:00')
    @end_time = Time.parse('2014-01-13 14:30')    
  end

  def test01_should_be_0_when_data_base_is_empty
    presentation = Presentation.new
    assert_equal 0, presentation.duration
  end

  def test02_should_find_duration_when_start_and_end_time_are_set
    presentation = Presentation.new
    presentation.start_time = @start_time
    presentation.end_time = @end_time
    assert_equal 30, presentation.duration
  end
  
  def test03_should_find_first_event_time
    $db.execute_sql("insert into polls values ('#{@start_time.to_f}', '', '', '')")   
    $db.execute_sql("insert into polls values ('#{@end_time.to_f}', '', '', '')") 
    presentation = Presentation.new    
    assert_equal @start_time, presentation.first_event_time
  end  
  
  def test04_should_find_last_event_time
    $db.execute_sql("insert into polls values ('#{@start_time.to_f}', '', '', '')")   
    $db.execute_sql("insert into polls values ('#{@end_time.to_f}', '', '', '')") 
    presentation = Presentation.new    
    assert_equal @end_time, presentation.last_event_time
  end    
  
  def test06_should_find_duration
    $db.execute_sql("insert into polls values ('#{@start_time.to_f}', '', '', '')")   
    $db.execute_sql("insert into polls values ('#{@end_time.to_f}', '', '', '')")   
    presentation = Presentation.new
    assert_equal 30, presentation.duration
  end

  def teardown
    $db.execute_sql("delete from polls")
  end

end

class TestPresentation_all_events < Test::Unit::TestCase

  def setup
    $db.execute_sql("delete from polls")
    @time_1 = Time.parse('2014-01-13 14:00')    
    @time_2 = Time.parse('2014-01-13 15:00')    
  end
  
  def test01_should_be_empty_when_initialized
    presentation = Presentation.new
    assert_equal [], presentation.all_events
  end
  
  def test02_should_find_one_event
    $db.execute_sql("insert into polls values ('#{@time_1.to_f}', 'user', 'question', 'answer')")     	  
    presentation = Presentation.new
    assert_equal ([[@time_1, 'user', 'question', 'answer']]).inspect, presentation.all_events.inspect
  end  
  
  def test02_should_find_to_all_events_in_order
    $db.execute_sql("insert into polls values ('#{@time_2.to_f}', 'user', 'question', 'answer')")  	  
    $db.execute_sql("insert into polls values ('#{@time_1.to_f}', 'user', 'question', 'answer')")     	  
    presentation = Presentation.new
    assert_equal ([[@time_1, 'user', 'question', 'answer'], [@time_2, 'user', 'question', 'answer']]).inspect, presentation.all_events.inspect
  end   
  
  def teardown
    $db.execute_sql("delete from polls")
  end  
	
end

class TestPresentation_ratings < Test::Unit::TestCase

  def setup
    $db.execute_sql("delete from polls")
    @time_1 = Time.parse('2014-01-13 14:00')    
    @time_2 = Time.parse('2014-01-13 15:00')    
  end
  
  def test01_shoud_be_empty_when_database_is_empty
    presentation = Presentation.new
    assert_equal [], presentation.ratings  
  end
  
  def test02_should_find_a_rating_event
    $db.execute_sql("insert into polls values ('#{@time_1.to_f}', 'user', 'evaluation', 'answer')")
    presentation = Presentation.new    
    assert_equal ([[@time_1, 'user', 'evaluation', 'answer']]).inspect, presentation.ratings.inspect
  end
  
  def test03_should_filter_to_find_one_rating_event
    $db.execute_sql("insert into polls values ('#{@time_1.to_f}', 'user', 'xx_evaluation', 'answer')")
    $db.execute_sql("insert into polls values ('#{@time_2.to_f}', 'user', 'x', 'answer')")
    presentation = Presentation.new    
    assert_equal ([[@time_1, 'user', 'xx_evaluation', 'answer']]).inspect, presentation.ratings.inspect
  end  
  
  def teardown
    $db.execute_sql("delete from polls")
  end    

end

class TestPresentation_users < Test::Unit::TestCase

  def setup
    $db.execute_sql("delete from polls")
  end    

  def test01_should_be_empty_when_no_events_in_database
    presentation = Presentation.new
    assert_equal [], presentation.users 
  end
  
  def test02_should_find_one_user
    $db.execute_sql("insert into polls values ('#{@time_1.to_f}', 'user', 'question', 'answer')")
    presentation = Presentation.new
    assert_equal ['user'], presentation.users 
  end  

  def test02_should_find_a_unique_user
    $db.execute_sql("insert into polls values ('#{@time_1.to_f}', 'user', 'question', 'answer')")
    $db.execute_sql("insert into polls values ('#{@time_1.to_f}', 'user', 'question', 'answer')")
    presentation = Presentation.new
    assert_equal ['user'], presentation.users 
  end  
  
  def teardown
    $db.execute_sql("delete from polls")
  end      
  
end

class TestPresentation_ratings_by_user < Test::Unit::TestCase
	
  def setup
    $db.execute_sql("delete from polls")	  
    @time_1 = Time.parse('2014-01-13 14:00')   
    @time_2 = Time.parse('2014-01-13 15:00')        
  end

  def test01_should_be_empty_when_initialized
    presentation = Presentation.new
    assert_equal ({}), presentation.ratings_by_user    
  end
  
  def test02_should_find_one_rating_for_one_user
    $db.execute_sql("insert into polls values ('#{@time_1.to_f}', 'user', 'evaluation', 'answer')")     	  
    presentation = Presentation.new
    assert_equal ({'user' => [[@time_1, 'user', 'evaluation', 'answer']]}).inspect, presentation.ratings_by_user.inspect
  end
  
  def test03_should_filter_to_find_one_rating_event
    $db.execute_sql("insert into polls values ('#{@time_1.to_f}', 'user', 'evaluation', 'answer')")	  
    $db.execute_sql("insert into polls values ('#{@time_2.to_f}', 'user', 'x', 'answer')")    	  
    presentation = Presentation.new
    assert_equal ({'user' => [[@time_1, 'user', 'evaluation', 'answer']]}).inspect, presentation.ratings_by_user.inspect
  end    
  
  def test04_should_find_two_ratings_for_the_same_user
    $db.execute_sql("insert into polls values ('#{@time_1.to_f}', 'user', 'evaluation', 'answer')")     	  
    $db.execute_sql("insert into polls values ('#{@time_2.to_f}', 'user', 'evaluation', 'answer')")     	  
    presentation = Presentation.new
    assert_equal ({'user' => [[@time_1, 'user', 'evaluation', 'answer'], [@time_2, 'user', 'evaluation', 'answer']]}).inspect, presentation.ratings_by_user.inspect
  end  
  
  def teardown
    $db.execute_sql("delete from polls")
  end   

end


class TestPresentation_ratings_by_question < Test::Unit::TestCase
	
  def setup
    $db.execute_sql("delete from polls")	  
    @time_1 = Time.parse('2014-01-13 14:00')	  
  end

  def test01_should_be_empty_when_initialized
    presentation = Presentation.new
    assert_equal ({}), presentation.ratings_by_question
  end
  
  def test02_should_find_one_question_rating
    $db.execute_sql("insert into polls values ('#{@time_1.to_f}', 'user', 'slide_1_evaluation', 'answer')")     	  
    presentation = Presentation.new
    assert_equal ({'slide_1_evaluation' => [[@time_1, 'user', 'slide_1_evaluation', 'answer']]}).inspect, presentation.ratings_by_question.inspect
  end  
  
  def teardown
    $db.execute_sql("delete from polls")	  
  end   

end

class TestPresentation_ratings_by_question_and_user < Test::Unit::TestCase
	
  def setup
    $db.execute_sql("delete from polls")	  
    @time_1 = Time.parse('2014-01-13 14:00')
    @time_2 = Time.parse('2014-01-13 15:00')       
  end

  def test01_should_be_empty_when_initialized
    presentation = Presentation.new
    assert_equal ({}), presentation.ratings_by_question_and_user
  end
  
  def test02_should_find_one_question_and_user_rating
    $db.execute_sql("insert into polls values ('#{@time_1.to_f}', 'user', 'slide_1_evaluation', 'answer')")     	  
    presentation = Presentation.new
    assert_equal ({'slide_1_evaluation' => { 'user' =>[ [@time_1, 'user', 'slide_1_evaluation', 'answer'] ]}}).inspect, presentation.ratings_by_question_and_user.inspect
  end  
  
  def test03_should_find_two_different_question_rating_for_the_same_user
    $db.execute_sql("insert into polls values ('#{@time_1.to_f}', 'user', 'slide_1_evaluation', 'answer')")     	  
    $db.execute_sql("insert into polls values ('#{@time_2.to_f}', 'user', 'slide_2_evaluation', 'answer')")     	  
    presentation = Presentation.new
    assert_equal ({'slide_1_evaluation' => { 'user' =>[ [@time_1, 'user', 'slide_1_evaluation', 'answer'] ]}, 'slide_2_evaluation' => { 'user' => [[@time_2, 'user', 'slide_2_evaluation', 'answer']] }}).inspect, presentation.ratings_by_question_and_user.inspect
  end   

  def test04_should_find_two_different_user_rating_for_the_same_question
    $db.execute_sql("insert into polls values ('#{@time_1.to_f}', 'user_1', 'slide_1_evaluation', 'answer')")     	  
    $db.execute_sql("insert into polls values ('#{@time_2.to_f}', 'user_2', 'slide_1_evaluation', 'answer')")     	  
    presentation = Presentation.new
    assert_equal ({'slide_1_evaluation' => { 'user_1' =>[ [@time_1, 'user_1', 'slide_1_evaluation', 'answer'] ], 'user_2' => [[@time_2, 'user_2', 'slide_1_evaluation', 'answer']] } } ).inspect, presentation.ratings_by_question_and_user.inspect
  end
  
  def teardown
    $db.execute_sql("delete from polls")	  
  end   

end

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

class TestPresentation_all_events < Test::Unit::TestCase
	
  def test01_should_initialize_event
    event = Event.new('timestamp', 'user_id', 'question_id', 'response')
    assert_equal 'timestamp', event.timestamp
    assert_equal 'user_id', event.user_id
    assert_equal 'question_id', event.question_id
    assert_equal 'response', event.response
  end
  
  def test02_should_give_a_string_representation
    event = Event.new('timestamp', 'user_id', 'question_id', 'response')
    assert_equal event.to_s, ['timestamp', 'user_id', 'question_id', 'response']
  end

end