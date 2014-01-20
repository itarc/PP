class Slide
	
  attr_accessor :title, :subtitle, :image_url, :video_url, :text, :question, :answer, :rate_answer
  
  def initialize(yaml_slide_structure = nil)
    return unless yaml_slide_structure
    @answers = []    
    yaml_slide_structure["slide"].each do |slide_property|
      slide_property_name = slide_property.keys[0]
      slide_property_value = slide_property[slide_property_name]
      eval '@' + slide_property_name + ' = "' + slide_property_value + '"'
      @answers << html_answer if @answer      
      @answers << html_rate_answer if @rate_answer      
    end

  end
  
  def html_title
    "<h1>#{@title}</h1>" if @title
  end  
  
  def html_subtitle
    "<h2>#{@subtitle}</h2>" if @subtitle
  end
  
  def html_image
     "<img src='#{@image_url}' width='100%'>" if @image_url
  end
  
  def html_video
    "<video src='#{@video_url}' controls></video>" if @video_url
  end
  
  def html_text
    "<h3>#{@text}</h3>" if @text
  end  
  
  def html_question
    "<div><div class='poll_question'>#{@question}</div>#{html_answers || html_answer}</div>" if @question
  end
  
  def html_answer
    input = "<input class='poll_radio' type='radio' id='poll_response_#{@answer}_to_#{question}' name='group_1' onclick='Slide.prototype.savePoll(this.id)'>"
    label = "<label for='poll_response_#{@answer}_to_#{@question}'>#{@answer}</label>"
    input + label if @answer
  end
  
  def html_rate_answer
      "<div><span class='poll_response'>#{@rate_answer}</span> <span id='poll_response_#{@rate_answer}_rate_to_#{@question}' class='poll_response_rate'>()</span></div>" if @rate_answer
  end
  
  def answer=(answer)
    @answer = answer
    if @answers then @answers << html_answer else @answers = [html_answer] end
  end
  
  def rate_answer=(rate_answer)
    @rate_answer = rate_answer
    if @rate_answers then @answers << html_rate_answer else @answers = [html_rate_answer] end
  end  
  
  def html_answers
    @answers.join if ( @answers || @rate_answer )
  end	  
  
  def html_section
     section_content = html_text || html_image || html_video || html_question
     "<section>#{ section_content }</section>" if section_content
  end
  
  def html
      "<div class='slide'>#{html_title}#{html_subtitle}#{html_section}</div>"
  end
  
end


if __FILE__ == $0 then
	
  require 'test/unit'
  
  $image_url = 'htpp://image.com/image'
  $video_url = 'htpp://video.com/image'
  $title = 'TITLE'
  $subtitle = 'SUBTITLE'
  $text = "TEXTE"
  $question = "Question ?"
  $answer = "Answer"

  class TestSlideElements < Test::Unit::TestCase

    def setup
    end
    
    def test010
	
      slide = Slide.new
      slide.title = $title
      
      expected = "<h1>#{$title}</h1>"
      assert_equal expected, slide.html_title

    end  

    def test020
	
      slide = Slide.new
      slide.subtitle = $subtitle
      
      expected = "<h2>#{$subtitle}</h2>"
      assert_equal expected, slide.html_subtitle

    end 
  
    def test030
	
      slide = Slide.new
      slide.image_url = $image_url
      
      expected = "<img src='#{$image_url}' width='100%'>"
      assert_equal expected, slide.html_image

    end

    def test040
	
      slide = Slide.new
      slide.video_url = $video_url
      
      expected = "<video src='#{$video_url}' controls></video>"
      assert_equal expected, slide.html_video

    end   

    def test050
	
      slide = Slide.new
      slide.text = $text
      
      expected = "<h3>#{$text}</h3>"
      assert_equal expected, slide.html_text

    end
    
    def test051
	
      slide = Slide.new
      slide.question = $question
      
      expected = "<div><div class='poll_question'>#{$question}</div></div>"
      assert_equal expected, slide.html_question

    end
    
    def test052
	
      slide = Slide.new
      slide.question = $question
      slide.answer = $answer

      expected_input = "<input class='poll_radio' type='radio' id='poll_response_#{$answer}_to_#{$question}' name='group_1' onclick='Slide.prototype.savePoll(this.id)'>"
      expected_label = "<label for='poll_response_#{$answer}_to_#{$question}'>#{$answer}</label>"
       
      expected =  expected_input +  expected_label
 
      assert_equal expected, slide.html_answer

    end 

    def test053
	
      slide = Slide.new
      slide.question = $question
      slide.answer = $answer

      expected_input = "<input class='poll_radio' type='radio' id='poll_response_#{$answer}_to_#{$question}' name='group_1' onclick='Slide.prototype.savePoll(this.id)'>"
      expected_label = "<label for='poll_response_#{$answer}_to_#{$question}'>#{$answer}</label>"
       
      expected =  expected_input +  expected_label
 
      assert_equal expected, slide.html_answers

    end   
    
    def test054
	
      slide = Slide.new
      slide.question = $question
      slide.answer = $answer
      slide.answer = $answer

      expected_input = "<input class='poll_radio' type='radio' id='poll_response_#{$answer}_to_#{$question}' name='group_1' onclick='Slide.prototype.savePoll(this.id)'>"
      expected_label = "<label for='poll_response_#{$answer}_to_#{$question}'>#{$answer}</label>"
       
      expected =  expected_input +  expected_label + expected_input + expected_label
 
      assert_equal expected, slide.html_answers

    end    

    
    def test055
	
      slide = Slide.new
      slide.question = $question
      slide.rate_answer = $answer
       
      expected = "<div><span class='poll_response'>#{$answer}</span> <span id='poll_response_#{$answer}_rate_to_#{$question}' class='poll_response_rate'>()</span></div>"

      assert_equal expected, slide.html_answers

    end 

    def test056
	
      slide = Slide.new
      slide.question = $question
      slide.rate_answer = $answer
      slide.rate_answer = $answer

      expected = "<div><span class='poll_response'>#{$answer}</span> <span id='poll_response_#{$answer}_rate_to_#{$question}' class='poll_response_rate'>()</span></div>"
      expected += expected
      
      assert_equal expected, slide.html_answers

    end 
    
    def test060 # TEST A REFAIRE : il tester la construction de la section sans retester tous le cas de fugure avec image, video, text, ...
	
      slide = Slide.new

      expected = nil
      assert_equal expected, slide.html_section

    end    
    
    def test99 # TEST A REFAIRE : il tester la construction du slide sans retester tous le cas de fugure avec image, video, text, ...
	
      slide = Slide.new
      
      expected = "<div class='slide'></div>"
      assert_equal expected, slide.html

    end      

    def test100 # TEST A REFAIRE : il tester la construction du slide sans retester tous le cas de fugure avec image, video, text, ...
	
      slide = Slide.new
      slide.title = $title
      slide.subtitle = $subtitle
      slide.image_url = $image_url
      
      expected = "<div class='slide'><h1>#{$title}</h1><h2>#{$subtitle}</h2><section><img src='#{$image_url}' width='100%'></section></div>"
      assert_equal expected, slide.html

    end  
    
    def test110 # TEST A REFAIRE : il tester la construction du slide sans retester tous le cas de fugure avec image, video, text, ...
	
      slide = Slide.new
      slide.title = $title
      slide.subtitle = $subtitle
      slide.video_url = $video_url
      
      expected = "<div class='slide'><h1>#{$title}</h1><h2>#{$subtitle}</h2><section><video src='#{$video_url}' controls></video></section></div>"
      assert_equal expected, slide.html

    end    
    
    def test120 # TEST A REFAIRE : il tester la construction du slide sans retester tous le cas de fugure avec image, video, text, ...
	
      slide = Slide.new
      slide.text = $text
      
      expected = "<div class='slide'><section><h3>#{$text}</h3></section></div>"
      assert_equal expected, slide.html

    end 

    def test130 # TEST A REFAIRE : il tester la construction du slide sans retester tous le cas de fugure avec image, video, text, ...
	
      slide = Slide.new
      slide.question = $question
      
      expected = "<div class='slide'><section><div><div class='poll_question'>#{$question}</div></div></section></div>"
      assert_equal expected, slide.html

    end

    def teardown
    end
  
  end  
  
  require 'yaml'
  
  class TestSlideGeneration < Test::Unit::TestCase

    def setup
    end
    
    def test01_image
	    
	yaml_fixture = %Q{
    - slide:
      - title: #{$title}
      - subtitle: #{$subtitle}
      - image_url: "#{$image_url}"}
	
	html_fixture = "<div class='slide'><h1>#{$title}</h1><h2>#{$subtitle}</h2><section><img src='#{$image_url}' width='100%'></section></div>"
	
	slide = Slide.new(YAML.load(yaml_fixture)[0])
	
	assert_equal html_fixture, slide.html
	
    end

    def test02_video
	    
	yaml_fixture = %Q{
    - slide:
      - title: #{$title}
      - subtitle: #{$subtitle}
      - video_url: "#{$video_url}"}
	
	html_fixture = "<div class='slide'><h1>#{$title}</h1><h2>#{$subtitle}</h2><section><video src='#{$video_url}' controls></video></section></div>"
	
	slide = Slide.new(YAML.load(yaml_fixture)[0])
	
	assert_equal html_fixture, slide.html
	
    end

    def test03_text
	    
	yaml_fixture = %Q{
    - slide:
      - text: "#{$text}"}
	
	html_fixture = "<div class='slide'><section><h3>#{$text}</h3></section></div>"
	
	slide = Slide.new(YAML.load(yaml_fixture)[0])
	
	assert_equal html_fixture, slide.html
	
    end

    def test04_poll
	    
	yaml_fixture = %Q{
    - slide:   
      - question : #{$question} 
      - answer : #{$answer}}

	html_label_fixture = "<label for='poll_response_#{$answer}_to_#{$question}'>#{$answer}</label>"
	html_input_fixture = "<input class='poll_radio' type='radio' id='poll_response_#{$answer}_to_#{$question}' name='group_1' onclick='Slide.prototype.savePoll(this.id)'>"
        html_question_fixture = "<div class='poll_question'>#{$question}</div>#{html_input_fixture}#{html_label_fixture}"
	
	html_fixture = "<div class='slide'><section><div>#{html_question_fixture}</div></section></div>"
	
	slide = Slide.new(YAML.load(yaml_fixture)[0])
	
	assert_equal html_fixture, slide.html
	
   end

    def test05_poll
	    
	yaml_fixture = %Q{
    - slide:   
      - question : #{$question} 
      - answer : #{$answer}
      - answer : #{$answer}}

	html_label_fixture = "<label for='poll_response_#{$answer}_to_#{$question}'>#{$answer}</label>"
	html_input_fixture = "<input class='poll_radio' type='radio' id='poll_response_#{$answer}_to_#{$question}' name='group_1' onclick='Slide.prototype.savePoll(this.id)'>"
        html_question_fixture = "<div class='poll_question'>#{$question}</div>#{html_input_fixture}#{html_label_fixture}#{html_input_fixture}#{html_label_fixture}"
	
	html_fixture = "<div class='slide'><section><div>#{html_question_fixture}</div></section></div>"
	
	slide = Slide.new(YAML.load(yaml_fixture)[0])
	
	assert_equal html_fixture, slide.html
	
    end

    def test06_poll
	    
	yaml_fixture = %Q{
    - slide:   
      - question : #{$question} 
      - answer_rate : #{$answer}}

        html_rate_fixture = "<div><span class='poll_response'>Oui</span> <span id='poll_response_1_rate_to_question_1' class='poll_response_rate'>()</span></div>"
        html_question_fixture = "<div class='poll_question'>#{$question}</div>#{html_rate_fixture}"
	
	html_fixture = "<div class='slide'><section><div>#{html_question_fixture}</div></section></div>"
	
	slide = Slide.new(YAML.load(yaml_fixture)[0])
	
	assert_equal html_fixture, slide.html
	
     end

    def teardown
    end

  end

end