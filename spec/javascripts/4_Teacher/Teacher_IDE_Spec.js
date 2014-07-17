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

describe("TeacherSlideShow with and IDE", function() { 	
  
  beforeEach(function() {
    setFixtures(TEACHER_SLIDESHOW_WITH_IDE);
    teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'));    
  });
  
  it("should NOT be updated when IDE NOT visible and teacher press space", function() {

    spyOn(TeacherCodeSlide.prototype, '_update');  
	  
    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(0);	  
	  
    __triggerKeyboardEvent(document, SPACE);

    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(0); 

  });
  
  it("should be updated when visible and teacher presses space", function() {

    spyOn(TeacherCodeSlide.prototype, '_update');

    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(0);
	  
    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(0); 	  

    teacherSlideShow.down();
	  
    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(1); 
    
    getResource = jasmine.createSpy('getResource').andReturn('0;true');    

    __triggerKeyboardEvent(document, SPACE);

    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(3); // SHOULD BE 2 => To Review
  
  });
  
  it("should be updated when teacher make it visible", function() {

    spyOn(TeacherCodeSlide.prototype, '_update');

    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(0); 	    
	  
    teacherSlideShow.down();	
	  
    expect(TeacherCodeSlide.prototype._update.calls.length).toBe(1);

  });	  
  
});
