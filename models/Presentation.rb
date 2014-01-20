require 'time'

require_relative 'Event'

require_relative '../db/Accesseur'  
$db = Accesseur.new

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
  
  def last_events
    all_events = $db.execute_sql("select distinct on(user_id) timestamp, user_id, question_id, response from polls order by user_id, timestamp desc").values
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
  
  def global_evaluation
    global_evaluations=last_events.select { |rating|   /global_evaluation/ =~ rating.question_id }
    sum = 0
    global_evaluations.each do |user_global_evaluation| # Try with an array.inject
      sum += user_global_evaluation.response.to_i
    end
    average = (sum.to_f / global_evaluations.size).round(2) if sum != 0
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

