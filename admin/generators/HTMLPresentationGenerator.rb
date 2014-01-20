
$head = %Q{
<link href='slideshow.css' rel='stylesheet' media='screen'/>
<meta name='viewport' content='user-scalable=no,width=device-width' />
<meta charset='utf8'>
}
$open_presentation= "<div class='presentation'>"

$close_presentation= "</div> <!--presentation-->"

$scripts = %Q{
<script src='slideshow.js'></script>
<script src='slideshow-teacher.js'></script>
}

$before_slides = "<html>\n<header>" + $head + "<body>\n" + $open_presentation + "\n"
$after_slides = $close_presentation + "\n</body>" + $scripts + "</html>"

require_relative'HTMLSlideGenerator'
require 'yaml'

class Presentation
	
  def initialize(yaml_string = nil)
     @html_slides = []	  
     return unless yaml_string
     YAML.load(yaml_string).each do |yaml_slide|
	@html_slides << Slide.new(yaml_slide).html
     end
  end

  def html
    $before_slides + @html_slides.join + $after_slides
  end

end

if __FILE__ == $0 then
	
  require 'test/unit'
  
  $image_url = 'htpp://image.com/image'
  $title = 'TITLE'
  $subtitle = 'SUBTITLE'
  $image_slide = "<div class='slide'><h1>#{$title}</h1><h2>#{$subtitle}</h2><section><img src='#{$image_url}' width='100%'></section></div>"
  

  class TestSlideElements < Test::Unit::TestCase

    def setup
    end
    
    def test01

      presentation = Presentation.new
      assert_equal $before_slides + $after_slides, presentation.html

    end

    def test02
	    
	presentation_fixture = %Q{
    - slide:
      - title: #{$title}
      - subtitle: #{$subtitle}
      - image_url: "#{$image_url}"}	    

      presentation = Presentation.new(presentation_fixture)
      assert_equal $before_slides + $image_slide + $after_slides, presentation.html
      
    end	    
    
    def test02
	    
	presentation_fixture = %Q{
    - slide:
      - title: #{$title}
      - subtitle: #{$subtitle}
      - image_url: "#{$image_url}"  
    - slide:
      - title: #{$title}
      - subtitle: #{$subtitle}
      - image_url: "#{$image_url}"}	       

      presentation = Presentation.new(presentation_fixture)
      assert_equal $before_slides + $image_slide + $image_slide + $after_slides, presentation.html

    end 
    
    def setup
    end

  end

end