describe("TeacherSlideShow Navigation with 1 Slide", function() {

  it("should have one current slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'></div></div>");
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'));

    expect(teacherSlideShow._slides.length).toBe(1);	  
    expect(teacherSlideShow._slides[0] instanceof Slide).toBe(true);

    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current');
    expect(teacherSlideShow._currentIndex).toBe(0);

  });
  
   it("should init server with currentIndex when teacher slideshow is intialized", function() {

    spyOn(TeacherSlideShow.prototype, '_postCurrentIndexOnServer');

    var teacherSlideShow = new TeacherSlideShow([]);

    expect(TeacherSlideShow.prototype._postCurrentIndexOnServer.call.length).toBe(1);

  });
  
});

describe("TeacherSlideShow Navigation with 2 Slides", function() {

  it("should open on first slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))

    expect(teacherSlideShow._slides.length).toBe(2);	  
    expect(teacherSlideShow._slides[0] instanceof Slide).toBe(true)
    expect(teacherSlideShow._slides[1] instanceof Slide).toBe(true)

    expect(teacherSlideShow._currentIndex).toBe(0)	  

    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')

  });  
  
  it("should go to second slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
	  
    expect(teacherSlideShow._currentIndex).toBe(1)	  
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide current')

  });    
  
  it("should go to second slide and go back to first slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, LEFT_ARROW)
	  
    expect(teacherSlideShow._currentIndex).toBe(0)	  
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')

  }); 

  it("should show first slide when home pressed", function() {

    setFixtures("<div class='slides'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, HOME)	  

    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')	  
 
  });    

});

describe("TeacherSlideShow Navigation with 3 Slides", function() {

  it("should open on first slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))
	  
    expect(teacherSlideShow._slides.length).toBe(3);	  

    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')	  
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide')	  
	  
  })
  
  it("should go to second slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide')	  

  }); 

  it("should go to third slide", function() {

    setFixtures("<div class='slides'><div class='slide'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, RIGHT_ARROW)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide current')	  
    
  });   

  it("should go back to second slide", function() {

    setFixtures("<div class='slides'><div class='slide'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, LEFT_ARROW)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide')		  
    
  }); 
  
  it("should go back to first slide", function() {

    setFixtures("<div class='slides'><div class='slide'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, LEFT_ARROW)
    __triggerKeyboardEvent(document, LEFT_ARROW)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide')	  
    
  })
  
});

describe("TeacherSlideShow Navigation With a Coding Slide At The End", function() {

  it("should not go beyond penultimate slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'></div><div class='slide'><textarea id='code_input'>puts 1</textarea><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))
	  
    expect(teacherSlideShow._currentIndex).toBe(0)	  
	  
    __triggerKeyboardEvent(document, RIGHT_ARROW)
	  
    expect(teacherSlideShow._currentIndex).toBe(0)
	  
  });
  
  it("should show last slide if coding slide and arrow down pressed", function() {
    
    setFixtures("<div class='slides'><div class='slide'></div><div class='slide'><textarea id='code_input'>puts 1</textarea><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))
	  
    expect(teacherSlideShow._last_slide()._node.className).toBe('slide')  
	  
    __triggerKeyboardEvent(document, DOWN_ARROW)
	  
    expect(teacherSlideShow._last_slide()._node.className).toBe('slide current')    
    
  });  
  
  it("should show current slide if coding slide and arrow up pressed", function() {
    
    setFixtures("<div class='slides'><div class='slide'></div><div class='slide'><textarea id='code_input'>puts 1</textarea><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current') 
	  
    __triggerKeyboardEvent(document, DOWN_ARROW)
    
    expect(teacherSlideShow._last_slide()._node.className).toBe('slide current') 
    
    __triggerKeyboardEvent(document, UP_ARROW)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current') 
    
  });   
  
  it("should NOT show last slide if NOT coding slide and arrow down pressed", function() {
    
    setFixtures("<div class='slides'><div class='slide'/><div class='slide'/></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current') 
    expect(teacherSlideShow._showIDE).toBe(false) 
	  
    __triggerKeyboardEvent(document, DOWN_ARROW)
    
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current')  
    expect(teacherSlideShow._showIDE).toBe(false)     
    
    __triggerKeyboardEvent(document, UP_ARROW)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current') 
    expect(teacherSlideShow._showIDE).toBe(false)     
    
  });
  
  it("should NOT show current slide when teacher shows IDE", function() {
	  
   setFixtures("<div class='slides'><div class='slide'></div><div class='slide'></div><div class='slide'><div id='code_input'><div class='code_helper'></div><div class='code_helper'></div><div id='execute'><div id='send_code'><div id='code_output'></div></div>")	  
   spyOn(TeacherSlideShow.prototype, '_show_current_slide');
   spyOn(CodeSlide.prototype, 'lastSend').andReturn('');
	  
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))

    expect(TeacherSlideShow.prototype._show_current_slide.calls.length).toBe(1);

    teacherSlideShow.down();

    teacherSlideShow.next(); 
    expect(TeacherSlideShow.prototype._show_current_slide.calls.length).toBe(1);

    teacherSlideShow.prev(); 
    expect(TeacherSlideShow.prototype._show_current_slide.calls.length).toBe(1);

    teacherSlideShow.synchronise();  
    expect(TeacherSlideShow.prototype._show_current_slide.calls.length).toBe(1);    

    teacherSlideShow.up();
    expect(TeacherSlideShow.prototype._show_current_slide.calls.length).toBe(2);	  
	  
    teacherSlideShow.next(); 
    expect(TeacherSlideShow.prototype._show_current_slide.calls.length).toBe(3);

    teacherSlideShow.prev();  
    expect(TeacherSlideShow.prototype._show_current_slide.calls.length).toBe(4);

    teacherSlideShow.synchronise();  
    expect(TeacherSlideShow.prototype._show_current_slide.calls.length).toBe(4); // same slide as current slide

  });  
  
});


