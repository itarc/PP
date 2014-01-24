require 'stringio'
  
def eval_ruby(ruby_code)
 
  io = StringIO.new
  begin
    $stdout = $stderr = io
    result = eval(ruby_code)
  rescue Exception => e
    result = e
  ensure
    $stdout = STDOUT
    $stderr = STDERR
  end
  
  if io.string.empty?
    case result
    when String
      result
    else
      result.to_s
    end
  else
    io.string
  end  
  
end

def run_ruby(ruby_code, user)
  file_name = "ruby_file_to_run.#{Time.now.to_f}.rb"
  file = File.new(file_name, 'w')
  file << ruby_code
  file.close
  result = `ruby #{file_name} 2>&1`
  File.delete(file)
  RunTimeEvent.new(user, ruby_code, result).save
  result
end

require_relative '../db/Accesseur'  
$db = Accesseur.new

class RunTimeEvent
  attr_accessor :timestamp, :user, :code_input, :code_output
  
  def initialize(user, code_input, code_output, timestamp = nil)
    @timestamp = timestamp || Time.now.to_f
    @user = user
    @code_input = code_input
    @code_output = code_output
  end
  
  def save
    $db.execute_sql("insert into run_events values ('#{@timestamp}', '#{@user}', '#{$db.format_to_sql(@code_input)}', '#{$db.format_to_sql(@code_output)}')")
  end
  
  def RunTimeEvent.find(user)
    RunTimeEvent.find_all.select { |event|  event.user == user }
  end
  
  def RunTimeEvent.find_all
    events = $db.execute_sql("select timestamp, user_id, code_input, code_output from run_events order by timestamp asc").values
    events.map { |tuple| RunTimeEvent.new(tuple[1], tuple[2], tuple[3], tuple[0]) }
  end
  
  def to_s
    ([@user, @code_input, @code_output]).inspect
  end
  
end
