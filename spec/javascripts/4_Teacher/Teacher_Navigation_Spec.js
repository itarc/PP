describe("TeacherSlideShow Position (includes IDE)", function() {
  
  beforeEach(function() {
    setFixtures(TEACHER_SLIDESHOW_WITH_IDE);
    getResource = jasmine.createSpy('getResource').andReturn('0;false');
    postResource = jasmine.createSpy('postResource');     
    teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))
  }); 
  
  it("should be posted on server when slideshow initialized", function() {    
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + '0' + '&' + 'ide_displayed=false', ASYNCHRONOUS); 
  });  
  
  it("should be posted on server when teacher goes NEXT", function() {
    teacherSlideShow.next(); 
    
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + '1' + '&' + 'ide_displayed=false', ASYNCHRONOUS);     
  });  
  
  it("should be updated when teacher goes DOWN", function() {
    teacherSlideShow.down();
    
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + '0' + '&' + 'ide_displayed=true', ASYNCHRONOUS);         
  });  

  it("should be updated when teacher goes PREVIOUS", function() {   
    teacherSlideShow.next();
    teacherSlideShow.prev(); 
    
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + '0' + '&' + 'ide_displayed=false', ASYNCHRONOUS);        
  });   
  
  it("should be updated when teacher goes UP", function() {
    teacherSlideShow.down();
    teacherSlideShow.up();
     
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + '0' + '&' + 'ide_displayed=false', ASYNCHRONOUS);      
  });   
  
});

describe("TeacherSlideShow Navigation with 3 Slides (No IDE)", function() {
  
  beforeEach(function () {
    setFixtures("<div class='slides'><div class='slide'><div class='slide'><div class='slide'></div></div>")
    teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))    
  });  

  it("should open on first slide", function() {
    expect(teacherSlideShow._slides.length).toBe(3);	  

    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')	  
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide')
  })
  
  it("should go to second slide", function() {
    __triggerKeyboardEvent(document, RIGHT_ARROW)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide')	  
  }); 

  it("should go to third slide", function() {
    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, RIGHT_ARROW)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide current')
  });   

  it("should go back to second slide", function() {
    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, LEFT_ARROW)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide')		  
  }); 
  
  it("should go back to first slide", function() {
    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, LEFT_ARROW)
    __triggerKeyboardEvent(document, LEFT_ARROW)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide')	  
  })
  
  it("should NOT show last slide when arrow down pressed", function() {
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

describe("TeacherSlideShow Navigation With 3 Slides (includes IDE Slide)", function() {
  
  beforeEach(function() {
    setFixtures(TEACHER_SLIDESHOW_WITH_IDE);
    teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))
  });  

  it("should not go beyond penultimate slide (2nd slide)", function() {
    expect(teacherSlideShow.position._currentIndex).toBe(0)	  
	  
    __triggerKeyboardEvent(document, RIGHT_ARROW)
	  
    expect(teacherSlideShow.position._currentIndex).toBe(1)
    
    __triggerKeyboardEvent(document, RIGHT_ARROW)

    expect(teacherSlideShow.position._currentIndex).toBe(1)    
  });
  
  it("should show IDE Slide when ARROW DOWN pressed", function() {
    expect(teacherSlideShow._last_slide()._node.className).toBe('slide');
	  
    __triggerKeyboardEvent(document, DOWN_ARROW);
	  
    expect(teacherSlideShow._last_slide()._node.className).toBe('slide current');  
  });  
  
  it("should return to current slide when ARROW UP pressed", function() {
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current'); 
	  
    __triggerKeyboardEvent(document, DOWN_ARROW);
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide');
    __triggerKeyboardEvent(document, UP_ARROW);
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current');
  });
  
});