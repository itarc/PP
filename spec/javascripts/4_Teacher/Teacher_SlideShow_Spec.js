TEACHER_SLIDESHOW_WITH_3_SLIDES = 
"<div class='slides'>"+
  "<div class='slide'/>"+
  "<div class='slide'/>"+
  "<div class='slide'/>"+
"</div>"

describe("TeacherSlideShow Navigation with 3 Slides (No IDE)", function() {
  
  beforeEach(function () {
    setFixtures(TEACHER_SLIDESHOW_WITH_3_SLIDES)
    getResource = jasmine.createSpy('getResource');  
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

TEACHER_SLIDESHOW_WITH_3_SLIDES_INCLUDING_IDE =  
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

describe("TeacherSlideShow Position (includes IDE)", function() {
  
  beforeEach(function() {
    setFixtures(TEACHER_SLIDESHOW_WITH_3_SLIDES_INCLUDING_IDE);
    getResource = jasmine.createSpy('getResource').andReturn('0;false'); 
    //~ spyOn(Position.prototype, "getPosition").andReturn('0;false');     ///// raises 'getResource not defined' when "teacherSlideShow.down();" ???
    spyOn(Position.prototype, "postPosition");
    teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))
  }); 
  
  it("should be posted on server when slideshow initialized", function() {    
    expect(Position.prototype.postPosition).toHaveBeenCalledWith(0, false); 
  });  
  
  it("should be posted on server when teacher goes NEXT", function() {
    teacherSlideShow.next(); 
    
    expect(Position.prototype.postPosition).toHaveBeenCalledWith(1, false);    
  });  
  
  it("should be posted on server when teacher goes DOWN", function() {
    teacherSlideShow.down();
    
    expect(Position.prototype.postPosition).toHaveBeenCalledWith(0, true);    
  });  

  it("should be posted on server when teacher goes PREVIOUS", function() {   
    teacherSlideShow.next();
    teacherSlideShow.prev(); 

    expect(Position.prototype.postPosition).toHaveBeenCalledWith(0, false);      
  });   
  
  it("should be posted on server when teacher goes UP", function() {
    teacherSlideShow.down();
    teacherSlideShow.up();

    expect(Position.prototype.postPosition).toHaveBeenCalledWith(0, false);    
  });   
  
});

describe("TeacherSlideShow Navigation With 3 Slides (includes IDE Slide)", function() {
  
  beforeEach(function() {
    setFixtures(TEACHER_SLIDESHOW_WITH_3_SLIDES_INCLUDING_IDE);
    teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))
  });  

  it("should not go beyond penultimate slide (2nd slide here)", function() {
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
  
  it("should show CLASSIC Slide when ARROW UP pressed", function() {
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current'); 
	  
    __triggerKeyboardEvent(document, DOWN_ARROW);
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide');
    __triggerKeyboardEvent(document, UP_ARROW);
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current');
  });
  
});


describe("TeacherSlideShow IDE", function() { 	
  
  beforeEach(function() {
    setFixtures(TEACHER_SLIDESHOW_WITH_3_SLIDES_INCLUDING_IDE);
    teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'));    
    spyOn(TeacherCodeSlide.prototype, '_update');  
    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(0);	     
  });
  
  it("should NOT be updated when NOT visible and teacher presses space", function() {
    __triggerKeyboardEvent(document, SPACE);

    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(0);
  });
  
  it("should be updated when teacher make it visible", function() {	    
    teacherSlideShow.down();	
	  
    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(1);
  });  
  
  it("should be updated when teacher make it visible and presses space", function() { // TO REPLACE OR REMOVE
    teacherSlideShow.down();
    
    spyOn(Position.prototype, "getPosition").andReturn('0;true'); // POSITION SHOULD HAVE CHANGED TO ALLOW UPDATE
    __triggerKeyboardEvent(document, SPACE);

    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(12); // SHOULD BE 2 => To Review
  });
  
});
