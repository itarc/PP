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

def run_ruby(ruby_code)
  file_name = "ruby_file_to_run.#{Time.now.to_f}.rb"
  file = File.new(file_name, 'w')
  file << ruby_code
  file.close
  result = `ruby #{file_name} 2>&1`
  File.delete(file)
  result
end
