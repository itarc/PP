describe("TeacherSlideShow Code Slide", function() { 	
  
  it("should call updateEditorAndExecuteCode when first slide or space pressed", function() {

    setFixtures("<div class='slides'><div class='slide'><section><textarea id='code_input'></textarea><textarea class='code_helper'></textarea><input type='button' id='execute'><textarea id='code_output'></textarea></section></div></div>");
    spyOn(CodeSlide.prototype, 'updateEditorAndExecuteCode');

    expect(CodeSlide.prototype.updateEditorAndExecuteCode.calls.length).toBe(0);
	  
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'));	  
	  
    expect(CodeSlide.prototype.updateEditorAndExecuteCode.calls.length).toBe(1);   
	  
    __triggerKeyboardEvent(document, SPACE);

    expect(CodeSlide.prototype.updateEditorAndExecuteCode.calls.length).toBe(2);

  });  

  it("should NOT call updateEditorAndExecuteCode when slide is NOT a coding slide and space pressed", function() {

    setFixtures("<div class='slides'><div class='slide'/></div>");
    spyOn(CodeSlide.prototype, 'updateEditorAndExecuteCode');

    expect(CodeSlide.prototype.updateEditorAndExecuteCode.calls.length).toBe(0);
	  
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'));	  
    __triggerKeyboardEvent(document, SPACE);

    expect(CodeSlide.prototype.updateEditorAndExecuteCode.calls.length).toBe(1);  // same as test above

  });   
  
  it("should call updateEditorAndExecuteCode when coding slide is down slide", function() {

    setFixtures("<div class='slides'><div class='slide'></div><div class='slide'><section><textarea id='code_input'></textarea><textarea class='code_helper'></textarea><textarea class='code_helper'></textarea><input type='button' id='execute'><textarea id='code_output'></textarea></section></div></div>");
    spyOn(CodeSlide.prototype, 'updateEditorAndExecuteCode');

    expect(CodeSlide.prototype.updateEditorAndExecuteCode.calls.length).toBe(0);
	  
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'));
	  
    expect(CodeSlide.prototype.updateEditorAndExecuteCode.calls.length).toBe(0); 	  

    teacherSlideShow.down();
	  
    expect(CodeSlide.prototype.updateEditorAndExecuteCode.calls.length).toBe(1); 

    __triggerKeyboardEvent(document, SPACE);

    expect(CodeSlide.prototype.updateEditorAndExecuteCode.calls.length).toBe(3); // should be 2 ???
  
  });
  
});