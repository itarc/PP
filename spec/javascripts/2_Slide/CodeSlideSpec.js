describe("Code Slide", function() {

  it("should show current code_helper", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><textarea class='code_helper' id='code_helper_1'></textarea><textarea class='code_helper' id='code_helper_2'></textarea><input type='button' id='execute'><textarea id='code_output'></textarea></section><div>");

    var slide = new CodeSlide(codeSlideNode);

    slide.showCurrentCodeHelper(0);
	  
    expect(codeSlideNode.querySelector('#code_helper_1').className).toBe('code_helper current');
    expect(codeSlideNode.querySelector('#code_helper_2').className).toBe('code_helper');
	  
    slide.showCurrentCodeHelper(1);	

    expect(codeSlideNode.querySelector('#code_helper_1').className).toBe('code_helper');
    expect(codeSlideNode.querySelector('#code_helper_2').className).toBe('code_helper current');  

  });  
  
  it("should NOT show current code_helper if no code helper", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><input type='button' id='execute'><textarea id='code_output'></textarea></section><div>");

    var slide = new CodeSlide(codeSlideNode);

    slide.showCurrentCodeHelper(0);

  });	
	
  it("should update code editor", function() {
	  
   codeSlideNode = sandbox("<div class='slide'><section><textarea id='code_input'></textarea><input type='button' id='execute'/><textarea id='code_output'></textarea></section></div>");
   
   var slide = new CodeSlide(codeSlideNode);
	  
   expect(codeSlideNode.querySelector('#code_input').value).toBe('');

   slide.updateEditor("print 'editor updated'");
	  
   expect(codeSlideNode.querySelector('#code_input').value).toBe("print 'editor updated'");
    
  });  
  
  it("should show current helper and run code when updated", function() {
	  
    spyOn(CodeSlide.prototype, 'showCurrentCodeHelper');	  
    spyOn(CodeSlide.prototype, 'updateEditorAndExecuteCode');	  
    
    var slide = new CodeSlide(codeSlideNode);
	  
    slide._update();
	  
    expect(CodeSlide.prototype.showCurrentCodeHelper.calls.length).toBe(1);
    expect(CodeSlide.prototype.updateEditorAndExecuteCode.calls.length).toBe(1);
	  
  });

  it("should run code in code editor", function() {
  
    codeSlideNode = sandbox("<div class='slide'><section><textarea id='code_input'>puts 1</textarea><input type='button' id='execute'/><textarea id='code_output'></textarea></section></div>");
  
    postResource = jasmine.createSpy('postResource').andReturn('1');  
	  
    expect(codeSlideNode.querySelector('#code_input').value).toBe('puts 1');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('');	  
	  
    var slide = new CodeSlide(codeSlideNode);
    slide.executeCode()
	  
    expect(postResource).toHaveBeenCalled();
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/code_run_result', 'puts 1', SYNCHRONOUS);
	  
    expect(codeSlideNode.querySelector('#code_input').value).toBe('puts 1');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('1');
    
  });
  
  it("should run code when click on execute button", function() {
  
    codeSlideNode = sandbox("<div class='slide'><section><textarea id='code_input'>puts 1</textarea><input type='button' id='execute'/><textarea id='code_output'></textarea></section></div>");
  
    spyOn(CodeSlide.prototype, 'executeCode');
	  
    var slide = new CodeSlide(codeSlideNode);
    codeSlideNode.querySelector('#execute').click();

    expect(CodeSlide.prototype.executeCode).toHaveBeenCalled();
    
  });
  
  it("should run code when ALT-R pressed", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'>puts 1</textarea><input type='button' id='execute'/><textarea id='code_output'></textarea></section><div>");
    spyOn(CodeSlide.prototype, 'executeCode');
	  
    var slide = new CodeSlide(codeSlideNode);

    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), R, ALT);
	  
    expect(CodeSlide.prototype.executeCode).toHaveBeenCalled();

  });
  
  it("should run code and give current code helper index when ALT-R pressed", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper'></div><div class='code_helper'></div><input type='button' id='execute'/><textarea id='code_output'></textarea></section><div>");
    spyOn(CodeSlide.prototype, 'executeCode');
	  
    var slide = new CodeSlide(codeSlideNode);

    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), R, ALT);
	  
    expect(CodeSlide.prototype.executeCode).toHaveBeenCalledWith(0);
	  
    slide.showCurrentCodeHelper(1);
	  
    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), R, ALT);	  

    expect(CodeSlide.prototype.executeCode).toHaveBeenCalledWith(1);
	  
  });  

 it("should run last run if exists", function() {
  
    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><input type='button' id='execute'/><textarea id='code_output'></textarea></section><div>");
 
    expect(codeSlideNode.querySelector('#code_input').value).toBe('');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('');
	  
    getResource = jasmine.createSpy('getResource').andReturn('puts 2');
    postResource = jasmine.createSpy('postResource').andReturn('2');	  
	  
    var slide = new CodeSlide(codeSlideNode);

    slide.updateEditorAndExecuteCode();
	  
    expect(postResource).toHaveBeenCalled();	  
	  
    expect(getResource).toHaveBeenCalled();
    expect(getResource.calls.length).toBe(1);
    expect(getResource).toHaveBeenCalledWith('/code_last_run');

    expect(codeSlideNode.querySelector('#code_input').value).toBe('puts 2');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('2');
    
  });

  it("should run code helper code if last run does not exist", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper'><div class='code_to_display'>puts 'HELP CODE'</div></div><input type='button' id='execute'/><textarea id='code_output'></textarea></section></div>");

    var slide = new CodeSlide(codeSlideNode);

    getResource = jasmine.createSpy('getResource').andReturn('');
    spyOn(CodeSlide.prototype, 'executeCode');       
         
    expect(codeSlideNode.querySelector('#code_input').value).toBe("");

    slide.updateEditorAndExecuteCode(0);

    expect(codeSlideNode.querySelector('#code_input').value).toBe("puts 'HELP CODE'");

    expect(CodeSlide.prototype.executeCode).toHaveBeenCalled();      
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(1);

  });  
  
  it("should NOT run if no code in code helper and no last run", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper' id='code_helper_1'></div></div><input type='button' id='execute'/><textarea id='code_output'></textarea></section><div>");

    var slide = new CodeSlide(codeSlideNode);
         
    spyOn(CodeSlide.prototype, 'executeCode');       
    spyOn(CodeSlide.prototype, 'updateEditor');       
         
    expect(codeSlideNode.querySelector('#code_input').value).toBe("");

    slide.updateEditorAndExecuteCode(0);

    expect(codeSlideNode.querySelector('#code_input').value).toBe("");

    expect(CodeSlide.prototype.executeCode).not.toHaveBeenCalled();          
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(0); 
	  
    expect(CodeSlide.prototype.updateEditor).not.toHaveBeenCalled();          
    expect(CodeSlide.prototype.updateEditor.calls.length).toBe(0);	  

  });	  
  
});

