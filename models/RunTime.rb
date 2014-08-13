
def run_ruby(type, ruby_code, user, slide_index)

  # To Keep if want to avoid users to execute system commands
  undef_file_name = "undef_file.#{Time.now.to_f}.rb"
  undef_file = File.new(undef_file_name, 'w')  
  undef_file << "undef :exec\nundef :system\nundef :`\n"
  undef_file.close
  
  editor_file_name = "editor_file_#{Time.now.to_f }.rb" 
  editor_file = File.new(editor_file_name, 'w')  
  editor_file << ruby_code  
  editor_file.close
  
  run_file_name = "ruby_file_to_run_#{Time.now.to_f}.rb"
  run_file = File.new(run_file_name, 'w')
  run_file << "require_relative '#{ undef_file_name }'\n"
  run_file << "require_relative '#{ editor_file_name }'\n"
  run_file.close
  
  result = `ruby #{editor_file_name} 2>&1`     # undef_file unsed at the moment
  
  File.delete(undef_file)
  File.delete(editor_file)
  File.delete(run_file)
  
  RunTimeEvent.new(user, type, slide_index, ruby_code, result).save

  result
end

require_relative '../db/Accesseur'  
$db = Accesseur.new

$teacher_session_id = '0_#'

class RunTimeEvent
  attr_accessor :timestamp, :user, :type, :slide_index, :code_input, :code_output
  
  def initialize(user, type, slide_index, code_input, code_output, timestamp = nil)
    @timestamp = timestamp || Time.now.to_f
    @user = user
    @type = type
    @code_input = code_input
    @code_output = code_output
    @slide_index = slide_index
  end
  
  def save
    $db.execute_sql("insert into run_events values ('#{@timestamp}', '#{@user}', '#{@type}', '#{@slide_index}', '#{$db.format_to_sql(@code_input)}', '#{$db.format_to_sql(@code_output)}')")
  end
  
  def RunTimeEvent.find_all
    events = $db.execute_sql("select timestamp, user_id, type, slide_index, code_input, code_output from run_events order by timestamp asc").values
    events.map { |tuple| RunTimeEvent.new(tuple[1], tuple[2], tuple[3], tuple[4], tuple[5], tuple[0]) }
  end  
  
  def RunTimeEvent.find_last_user_execution_on_slide(user_id, slide_index)
    (RunTimeEvent.find_all.select { |event|  event.slide_index == slide_index && event.user == user_id && (event.type == 'run' ||  event.type == 'send') }).last
  end
  
  def RunTimeEvent.find_attendees_last_send_on_slide(user_id, slide_index)
    last_user_send = (RunTimeEvent.find_all.select { |event|  event.slide_index == slide_index && event.user == $teacher_session_id &&  ( event.type == 'send' ) }).last
    last_user_send_timestamp = ''
    last_user_send_timestamp = last_user_send.timestamp if last_user_send
    (RunTimeEvent.find_all.select { |event|  event.slide_index == slide_index && event.user != $teacher_session_id &&  ( event.type == 'send' ) && event.timestamp > last_user_send_timestamp}).last
  end    
  
  def RunTimeEvent.find_last_send_to_blackboard(slide_index)
    last_teacher_run_or_send_on_blackboard = (RunTimeEvent.find_all.select { |event|  event.slide_index == slide_index && event.user == $teacher_session_id && (event.type == 'run' || event.type == 'send')}).last
    if last_teacher_run_or_send_on_blackboard == nil then return nil end
    if last_teacher_run_or_send_on_blackboard.type == 'run' then return last_teacher_run_or_send_on_blackboard end
    if last_teacher_run_or_send_on_blackboard.type == 'send' then 
      return (RunTimeEvent.find_all.select { |event| event.slide_index == slide_index && event.user != $teacher_session_id && event.type == 'send' && event.timestamp < last_teacher_run_or_send_on_blackboard.timestamp }).last
    end
  end
  
  def to_s
    ([@user, @type, @slide_index, @code_input, @code_output]).inspect
  end
  
end
