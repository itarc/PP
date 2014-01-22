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
  file = File.new("file_to_execute.rb", 'w')
  file << ruby_code
  file.close
  result = `ruby file_to_execute.rb 2>&1`
  File.delete(file)
  result
end
