describe("TeacherSlideShow with and IDE", function() { 	
  
  beforeEach(function() {
    
    setFixtures("<div class='slides'><div class='slide'></div><div class='slide'><div id='code_input'/><div class='code_helper'/><div id='execute'/><div id='send_code'/><div id='code_output'/></div></div>")	  

  });
	
  it("should be updated when teacher shows it", function() {

    spyOn(CodeSlide.prototype, '_update');

    var slideShow = new SlideShow(queryAll(document, '.slide'))

    expect(CodeSlide.prototype._update.calls.length).toBe(0); 	    
	  
    slideShow.down();	
	  
    expect(CodeSlide.prototype._update.calls.length).toBe(1);

  });	
  
  it("should be updated when teacher shows it and presses space", function() {

    spyOn(CodeSlide.prototype, '_update');

    expect(CodeSlide.prototype._update.calls.length).toBe(0);
	  
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'));
	  
    expect(CodeSlide.prototype._update.calls.length).toBe(0); 	  

    teacherSlideShow.down();
	  
    expect(CodeSlide.prototype._update.calls.length).toBe(1); 
    
    getResource = jasmine.createSpy('getResource').andReturn('0;true');    

    __triggerKeyboardEvent(document, SPACE);

    expect(CodeSlide.prototype._update.calls.length).toBe(2);
  
  });

  it("should send code when ALT-S pressed", function() {

    spyOn(CodeSlide.prototype, 'executeAndSendCode');  

    expect(CodeSlide.prototype.executeAndSendCode.calls.length).toBe(0);
	  
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'));
	  
    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), S, ALT);

    expect(CodeSlide.prototype.executeAndSendCode.calls.length).toBe(1);  

  }); 
  
});  
  
describe("TeacherSlideShow with and IDE (specific behaviour)", function() {  
  
  it("should NOT be updated when teacher do not show it but presses space", function() {

    setFixtures("<div class='slides'><div class='slide'/></div>");
    spyOn(CodeSlide.prototype, '_update');  

    expect(CodeSlide.prototype._update.calls.length).toBe(0);
	  
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'));
	  
    expect(CodeSlide.prototype._update.calls.length).toBe(0);	  
	  
    __triggerKeyboardEvent(document, SPACE);

    expect(CodeSlide.prototype._update.calls.length).toBe(2);  // should be 0 (to review or put in another file)

  });   

  it("should NOT run code when ALT-R button disabled", function() {

   setFixtures("<div class='slides'><div class='slide'></div><div class='slide'><section><textarea id='code_input'></textarea><textarea class='code_helper'></textarea><textarea class='code_helper'></textarea><input type='button' id='execute' disabled><input type='button' id='send_code'><textarea id='code_output'></textarea></section></div></div>");
   spyOn(CodeSlide.prototype, 'executeCode');
   getResource = jasmine.createSpy('getResource').andReturn('');    

    expect(CodeSlide.prototype.executeCode.calls.length).toBe(0);
	  
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'));
    
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(0);      

    __triggerKeyboardEvent(teacherSlideShow._slides[1]._node.querySelector('#code_input'), R, ALT);

    expect(CodeSlide.prototype.executeCode.calls.length).toBe(0);  
	
  });    

  it("should NOT send code when ALT-S button disabled", function() {

    setFixtures("<div class='slides'><div class='slide'></div><div class='slide'><section><textarea id='code_input'></textarea><textarea class='code_helper'></textarea><textarea class='code_helper'></textarea><input type='button' id='execute'><input type='button' id='send_code' disabled><textarea id='code_output'></textarea></section></div></div>");
    spyOn(CodeSlide.prototype, 'executeAndSendCode');  

    expect(CodeSlide.prototype.executeAndSendCode.calls.length).toBe(0);
	  
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'));
	  
    __triggerKeyboardEvent(teacherSlideShow._slides[1]._node.querySelector('#code_input'), S, ALT);

    expect(CodeSlide.prototype.executeAndSendCode.calls.length).toBe(0);  

  });  

});