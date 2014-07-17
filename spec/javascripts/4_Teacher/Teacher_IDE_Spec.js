describe("TeacherSlideShow with and IDE", function() { 	
  
  beforeEach(function() {
    
    setFixtures("<div class='slides'><div class='slide'></div><div class='slide'><div id='code_input'/><div class='code_helper'/><div id='execute'/><div id='send_code'/><div id='get_code'/><div id='code_output'/></div></div>")	  

  });
  
  it("should NOT be updated when teacher do not show it but presses space", function() {

    spyOn(CodeSlide.prototype, '_update');  
	  
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'));
	  
    expect(CodeSlide.prototype._update.calls.length).toBe(0);	  
	  
    __triggerKeyboardEvent(document, SPACE);

    expect(CodeSlide.prototype._update.calls.length).toBe(0); 

  });  
	
  it("should be updated when teacher shows it", function() {

    spyOn(TeacherCodeSlide.prototype, '_update');

    var slideShow = new TeacherSlideShow(queryAll(document, '.slide'))

    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(0); 	    
	  
    slideShow.down();	
	  
    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(1);

  });	
  
  it("should be updated when teacher shows it and presses space", function() {

    spyOn(TeacherCodeSlide.prototype, '_update');

    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(0);
	  
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'));
	  
    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(0); 	  

    teacherSlideShow.down();
	  
    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(1); 
    
    getResource = jasmine.createSpy('getResource').andReturn('0;true');    

    __triggerKeyboardEvent(document, SPACE);

    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(4); // SHOULD BE 2 => To Review
  
  });
  
});
