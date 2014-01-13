require 'stringio'
  
def run_ruby(ruby_code)
 
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