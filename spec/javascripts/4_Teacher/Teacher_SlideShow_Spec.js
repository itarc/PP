TEACHER_SLIDESHOW_WITH_3_SLIDES = 
"<div class='slides'>"+
  "<div class='slide'/>"+
  "<div class='slide'/>"+
  "<div class='slide'/>"+
"</div>"

describe("TeacherSlideShow Current Slide Index", function() {
  
  beforeEach(function () {
    setFixtures(TEACHER_SLIDESHOW_WITH_3_SLIDES);
    spyOn(Position.prototype, "_getPosition").and.returnValue("0;false");    
    slideShow = new TeacherSlideShow(queryAll(document, '.slide'));
  });
	
  it("should be NEXT index when next slide is called", function() {
    slideShow._currentIndex = 1;
    slideShow._numberOfSlides = 3;	  

    slideShow.next();

    expect(slideShow._currentIndex).toBe(2)
  });
  
  it("should be PREVIOUS index when previous slide is called", function() {	  
    slideShow._currentIndex = 2;
    slideShow._numberOfSlides = 3;	  

    slideShow.prev()

    expect(slideShow._currentIndex).toBe(1)
  });

  it("should NOT be a slide beyond last slide", function() {
    slideShow._currentIndex = 2;
    slideShow._numberOfSlides = 3;

    slideShow.next()

    expect(slideShow._currentIndex).toBe(2)
  });
  
  it("should NOT be a slide under first slide", function() {
    slideShow._currentIndex = 0;
    slideShow._numberOfSlides = 3;

    slideShow.prev()

    expect(slideShow._currentIndex).toBe(0)
  });
  
});

describe("TeacherSlideShow Navigation", function() {
  
  beforeEach(function () {
    setFixtures(TEACHER_SLIDESHOW_WITH_3_SLIDES)
    spyOn(Position.prototype, "_getPosition").and.returnValue("0;false");  
    teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))
  });  

  it("should be on first slide when initialized", function() {
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
  });
  
  it("should go to first slide when HOME pressed", function() {
    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, HOME)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide')	 
  });   
  
  it("should NOT show last slide when ARROW DOWN pressed and NO IDE", function() {
    expect(teacherSlideShow.position._IDEDisplayed).toBe(false) 
	  
    __triggerKeyboardEvent(document, DOWN_ARROW)
    
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')	  
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide')
    expect(teacherSlideShow.position._IDEDisplayed).toBe(false)     
    
    __triggerKeyboardEvent(document, UP_ARROW)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')	  
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide') 
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

describe("TeacherSlideShow Navigation (includes IDE Slide)", function() {
  
  beforeEach(function() {
    setFixtures(TEACHER_SLIDESHOW_WITH_3_SLIDES_INCLUDING_IDE);
    spyOn(Position.prototype, "_getPosition").and.returnValue("0;false");  
    teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))
  });  

  it("should not go beyond penultimate slide (2nd slide here)", function() {  
    __triggerKeyboardEvent(document, RIGHT_ARROW)
	 	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide current') 
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide'); 
    
    __triggerKeyboardEvent(document, RIGHT_ARROW)

    expect(teacherSlideShow._slides[0]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide current') 
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide');    
  });
  
  it("should show IDE Slide when ARROW DOWN pressed", function() {
    __triggerKeyboardEvent(document, DOWN_ARROW);
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide') 
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide current');  
  });  
  
  it("should show CLASSIC Slide when ARROW UP pressed", function() {
    __triggerKeyboardEvent(document, DOWN_ARROW);
    
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide') 
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide current'); 
    
    __triggerKeyboardEvent(document, UP_ARROW);
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current');
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide') 
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide');     
  });
  
});

describe("TeacherSlideShow Position (includes IDE)", function() {
  
  beforeEach(function() {
    setFixtures(TEACHER_SLIDESHOW_WITH_3_SLIDES_INCLUDING_IDE);
    spyOn(Position.prototype, "_getPosition").and.returnValue('0;false');
    spyOn(Position.prototype, "_postPosition");
    teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))
  }); 
  
  it("should be posted on server when slideshow initialized", function() {    
    expect(Position.prototype._postPosition).toHaveBeenCalledWith(0, false); 
  });  
  
  it("should be posted on server when teacher goes NEXT", function() {
    teacherSlideShow.next(); 
    
    expect(Position.prototype._postPosition).toHaveBeenCalledWith(1, false);    
  });  
  
  it("should be posted on server when teacher goes DOWN", function() {
    teacherSlideShow.down();
    
    expect(Position.prototype._postPosition).toHaveBeenCalledWith(0, true);    
  });  

  it("should be posted on server when teacher goes PREVIOUS", function() {   
    teacherSlideShow.next();
    teacherSlideShow.prev(); 

    expect(Position.prototype._postPosition).toHaveBeenCalledWith(0, false);      
  });   
  
  it("should be posted on server when teacher goes UP", function() {
    teacherSlideShow.down();
    teacherSlideShow.up();

    expect(Position.prototype._postPosition).toHaveBeenCalledWith(0, false);    
  });   
  
  it("should be posted on server when teacher goes HOME", function() {
    teacherSlideShow.next();
    teacherSlideShow.home();

    expect(Position.prototype._postPosition.calls.count()).toBe(3);  // init + next + home  
    expect(Position.prototype._postPosition).toHaveBeenCalledWith(0, false);  // should check if Third call (home) is the good call
  });  
  
});


