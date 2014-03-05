describe("TeacherSlideShow Code Slide", function() { 	
	
  it("should be updated when teacher shows it", function() {

    setFixtures("<div class='slides'><div class='slide'></div><div class='slide'><div id='code_input'/><div id='execute'/><div id='send_code'/><div id='code_output'/></div></div>")	  
    spyOn(CodeSlide.prototype, '_update');

    var slideShow = new SlideShow(queryAll('.slide'))
	  
    slideShow.down();	
	  
    expect(CodeSlide.prototype._update.calls.length).toBe(1);

  });	

  it("should NOT be updated when teacher do not show it and press space", function() {

    setFixtures("<div class='slides'><div class='slide'/></div>");
    spyOn(CodeSlide.prototype, '_update');  

    expect(CodeSlide.prototype._update.calls.length).toBe(0);
	  
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'));
	  
    __triggerKeyboardEvent(document, SPACE);

    expect(CodeSlide.prototype._update.calls.length).toBe(0);  // same as test above

  });   
  
  it("should be updated when teacher shows it and press space", function() {

    setFixtures("<div class='slides'><div class='slide'></div><div class='slide'><section><textarea id='code_input'></textarea><textarea class='code_helper'></textarea><textarea class='code_helper'></textarea><input type='button' id='execute'><input type='button' id='send_code'><textarea id='code_output'></textarea></section></div></div>");
    spyOn(CodeSlide.prototype, '_update');

    expect(CodeSlide.prototype._update.calls.length).toBe(0);
	  
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'));
	  
    expect(CodeSlide.prototype._update.calls.length).toBe(0); 	  

    teacherSlideShow.down();
	  
    expect(CodeSlide.prototype._update.calls.length).toBe(1); 

    __triggerKeyboardEvent(document, SPACE);

    expect(CodeSlide.prototype._update.calls.length).toBe(2);
  
  });	    
  
});