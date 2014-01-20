require_relative 'HTMLPresentationGenerator'

#~ yaml_file = 'fixtures/image_slide.yaml'
yaml_file = ARGV[0]

puts Presentation.new(File.open(yaml_file).readlines.join).html