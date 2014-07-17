describe("TeacherSlideShow Navigation with 1 Slide", function() {

  it("should have one current slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'></div></div>");
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'));

    expect(teacherSlideShow._slides.length).toBe(1);	  
    expect(teacherSlideShow._slides[0] instanceof Slide).toBe(true);

    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current');
    expect(teacherSlideShow.position._currentIndex).toBe(0);

  });
  
});

describe("TeacherSlideShow Navigation with 2 Slides", function() {

  it("should open on first slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))

    expect(teacherSlideShow._slides.length).toBe(2);	  
    expect(teacherSlideShow._slides[0] instanceof Slide).toBe(true)
    expect(teacherSlideShow._slides[1] instanceof Slide).toBe(true)

    expect(teacherSlideShow.position._currentIndex).toBe(0)	  

    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')

  });  
  
  it("should go to second slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
	  
    expect(teacherSlideShow.position._currentIndex).toBe(1)	  
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide current')

  });    
  
  it("should go to second slide and go back to first slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, LEFT_ARROW)
	  
    expect(teacherSlideShow.position._currentIndex).toBe(0)	  
	  
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
  
  it("should NOT show last slide when arrow down pressed", function() {
    
    setFixtures("<div class='slides'><div class='slide'/><div class='slide'/></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current') 
    expect(teacherSlideShow.position._IDEDisplayed).toBe(false) 
	  
    __triggerKeyboardEvent(document, DOWN_ARROW)
    
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current')  
    expect(teacherSlideShow.position._IDEDisplayed).toBe(false)     
    
    __triggerKeyboardEvent(document, UP_ARROW)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current') 
    expect(teacherSlideShow.position._IDEDisplayed).toBe(false)     
    
  });  
  
});

HEADER = 
"<div class='slide'/>"+"<section>"
code_input = 
"<textarea id='code_input'></textarea>"
code_helpers = 
"<div class='code_helper' id='code_helper_1'></div>"+
"<div class='code_helper' id='code_helper_2'></div>"
author_bar = 
"<div class='code_author'><span id='author_name'></span></div>"
buttons = 
"<input type='button' id='execute'/>"+
"<input type='button' id='send_code'/>"+
"<input type='button' id='get_code'/>"
code_ouput = 
"<textarea id='code_output'></textarea>"
FOOTER = 
"</section>"+"</div>"

TEACHER_SLIDESHOW_WITH_IDE =  
"<div class='slides'>"+
"<div class='slide'></div>"+
"<div class='slide'></div>"+
HEADER + 
code_input + 
code_helpers + 
"<div class='code_author'>"+
"LAST ATTENDEE NAME: <span id='last_send_attendee_name'></span>"+
"AUTHOR NAME <span id='author_name'></span>"+
"</div>" +
buttons + 
"<input type='button' id='get_last_send'/>"+
code_ouput + 
FOOTER +
"/div"

//~ "<div class='slides'>"+
//~ "<div class='slide'>"+
//~ "</div>"+
//~ "<div class='slide'>"+
//~ "</div>"+
//~ "<div class='slide'>"+
//~ "<div id='code_input'>"+
//~ "<div class='code_helper'>"+
//~ "</div><div class='code_helper'>"+
//~ "</div><div id='execute'>"+
//~ "<div id='send_code'>"+
//~ "<div id='get_code'>"+
//~ "<div id='code_output'>"+
//~ "</div></div>"

describe("TeacherSlideShow Navigation With an IDE Slide", function() {
  
  beforeEach(function() {
    
   //~ setFixtures("<div class='slides'><div class='slide'></div><div class='slide'></div><div class='slide'><div id='code_input'><div class='code_helper'></div><div class='code_helper'></div><div id='execute'><div id='send_code'><div id='get_code'><div id='code_output'></div></div>")	  
   setFixtures(TEACHER_SLIDESHOW_WITH_IDE);

  });  

  it("should not go beyond penultimate slide", function() {
	  
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))
	  
    expect(teacherSlideShow.position._currentIndex).toBe(0)	  
	  
    __triggerKeyboardEvent(document, RIGHT_ARROW)
	  
    expect(teacherSlideShow.position._currentIndex).toBe(1)
    
    __triggerKeyboardEvent(document, RIGHT_ARROW)

    expect(teacherSlideShow.position._currentIndex).toBe(1)    
	  
  });
  
  it("should show IDE Slide when arrow down pressed", function() {
    
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))
	  
    expect(teacherSlideShow._last_slide()._node.className).toBe('slide')  
	  
    __triggerKeyboardEvent(document, DOWN_ARROW)
	  
    expect(teacherSlideShow._last_slide()._node.className).toBe('slide current')    
    
  });  
  
  it("should show return to current slide when arrow up pressed", function() {
    
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current') 
	  
    __triggerKeyboardEvent(document, DOWN_ARROW)
    
    expect(teacherSlideShow._last_slide()._node.className).toBe('slide current') 
    
    __triggerKeyboardEvent(document, UP_ARROW)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current') 
    
  });
  
  it("should update position on server", function() {
	  
    getResource = jasmine.createSpy('getResource').andReturn('0;false');
    postResource = jasmine.createSpy('postResource');
       
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({author: '', code: ''});     
    
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'));
    
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + '0' + '&' + 'ide_displayed=false', ASYNCHRONOUS); 
    
    postResource = jasmine.createSpy('postResource');
    teacherSlideShow.next(); 
    
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + '1' + '&' + 'ide_displayed=false', ASYNCHRONOUS);    

    postResource = jasmine.createSpy('postResource');
    teacherSlideShow.down();
    
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + '1' + '&' + 'ide_displayed=true', ASYNCHRONOUS);        

    postResource = jasmine.createSpy('postResource');
    teacherSlideShow.prev(); 
    
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + '0' + '&' + 'ide_displayed=true', ASYNCHRONOUS);     

    postResource = jasmine.createSpy('postResource');
    teacherSlideShow.up();
     
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + '0' + '&' + 'ide_displayed=false', ASYNCHRONOUS);      

  });  
  
});


