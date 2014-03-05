describe("Code Slide", function() {

  it("should show current code_helper", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><textarea class='code_helper' id='code_helper_1'></textarea><textarea class='code_helper' id='code_helper_2'></textarea><input type='button' id='execute'><input type='button' id='send_code'/><textarea id='code_output'></textarea></section><div>");

    var slide = new CodeSlide(codeSlideNode);

    slide.showCurrentCodeHelper(0);
	  
    expect(codeSlideNode.querySelector('#code_helper_1').className).toBe('code_helper current');
    expect(codeSlideNode.querySelector('#code_helper_2').className).toBe('code_helper');
	  
    slide.showCurrentCodeHelper(1);	

    expect(codeSlideNode.querySelector('#code_helper_1').className).toBe('code_helper');
    expect(codeSlideNode.querySelector('#code_helper_2').className).toBe('code_helper current');  

  });  
  
  it("should NOT show current code_helper if no code helper", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><input type='button' id='execute'><input type='button' id='send_code'/><textarea id='code_output'></textarea></section><div>");

    var slide = new CodeSlide(codeSlideNode);

    slide.showCurrentCodeHelper(0);

  });	
	
  it("should update code editor", function() {
	  
   codeSlideNode = sandbox("<div class='slide'><section><textarea id='code_input'></textarea><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></section></div>");
   
   var slide = new CodeSlide(codeSlideNode);
	  
   expect(codeSlideNode.querySelector('#code_input').value).toBe('');

   slide.updateEditor("print 'editor updated'");
	  
   expect(codeSlideNode.querySelector('#code_input').value).toBe("print 'editor updated'");
    
  }); 
  
  it("should run code in code editor", function() {
  
    codeSlideNode = sandbox("<div class='slide'><section><textarea id='code_input'>puts 1</textarea><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></section></div>");
  
    postResource = jasmine.createSpy('postResource').andReturn('1');  
	  
    expect(codeSlideNode.querySelector('#code_input').value).toBe('puts 1');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('');	  
	  
    var slide = new CodeSlide(codeSlideNode);
    slide.executeCode()
	  
    expect(postResource).toHaveBeenCalled();
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', 'puts 1', SYNCHRONOUS);
	  
    expect(codeSlideNode.querySelector('#code_input').value).toBe('puts 1');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('1');
    
  });  
  
  it("should show current helper and run code when updated", function() {
	  
    spyOn(CodeSlide.prototype, 'showCurrentCodeHelper');	  
    spyOn(CodeSlide.prototype, 'updateEditorAndExecuteCode');	  
    
    var slide = new CodeSlide(codeSlideNode);
	  
    slide._update();
	  
    expect(CodeSlide.prototype.showCurrentCodeHelper.calls.length).toBe(1);
    expect(CodeSlide.prototype.updateEditorAndExecuteCode.calls.length).toBe(1);
	  
  });
  
  it("should run code of current slide when click on execute button", function() {
  
    codeSlideNode = sandbox("<div class='slide'><section><textarea id='code_input'>puts 1</textarea><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></section></div>");
  
    postResource = jasmine.createSpy('postResource'); 	  
	  
    var slide = new CodeSlide(codeSlideNode);
    codeSlideNode.querySelector('#execute').click();

    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', 'puts 1', SYNCHRONOUS);	  
    
  });
  
  it("should run code of current slide when ALT-R pressed", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper'></div><div class='code_helper'></div><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></section><div>");
    postResource = jasmine.createSpy('postResource'); 		  
	  
    var slide = new CodeSlide(codeSlideNode);

    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), R, ALT);
	  
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', '', SYNCHRONOUS);		  
	  
    slide.showCurrentCodeHelper(1);
	  
    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), R, ALT);	  

    expect(postResource).toHaveBeenCalledWith('/code_run_result/1', '', SYNCHRONOUS);		  
	  
  });  
  
  it("should run and send code of current slide when click on send button", function() {
  
    codeSlideNode = sandbox("<div class='slide'><section><textarea id='code_input'>puts 1</textarea><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></section></div>");
  
    postResource = jasmine.createSpy('postResource'); 	  
	  
    var slide = new CodeSlide(codeSlideNode);
    codeSlideNode.querySelector('#send_code').click();

    expect(postResource).toHaveBeenCalledWith('/code_send_result/0', 'puts 1', SYNCHRONOUS);	  
    
  });
  
  it("should run code of current slide when ALT-S pressed", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper'></div><div class='code_helper'></div><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></section><div>");
    postResource = jasmine.createSpy('postResource'); 		  
	  
    var slide = new CodeSlide(codeSlideNode);

    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), S, ALT);
	  
    expect(postResource).toHaveBeenCalledWith('/code_send_result/0', '', SYNCHRONOUS);		  
	  
    slide.showCurrentCodeHelper(1);
	  
    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), S, ALT);	  

    expect(postResource).toHaveBeenCalledWith('/code_send_result/1', '', SYNCHRONOUS);		  
	  
  });   

 it("should run last send if exists", function() {
  
    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></section><div>");
 
    expect(codeSlideNode.querySelector('#code_input').value).toBe('');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('');
	  
    getResource = jasmine.createSpy('getResource').andReturn('puts 2');
    postResource = jasmine.createSpy('postResource').andReturn('2');	  
	  
    var slide = new CodeSlide(codeSlideNode);

    slide.updateEditorAndExecuteCode();
	  
    expect(postResource).toHaveBeenCalled();	  
	  
    expect(getResource).toHaveBeenCalled();
    expect(getResource.calls.length).toBe(1);
    expect(getResource).toHaveBeenCalledWith('/code_last_send/0');
	 
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', 'puts 2', SYNCHRONOUS);	 

    expect(codeSlideNode.querySelector('#code_input').value).toBe('puts 2');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('2');
    
  });

  it("should run code to display if last send does not exist", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper'><div class='code_to_display'>puts 'CODE TO DISPLAY'</div></div><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></section></div>");
    spyOn(CodeSlide.prototype, 'lastSend').andReturn('');
	  
    var slide = new CodeSlide(codeSlideNode);

    postResource = jasmine.createSpy('postResource'); 		  
         
    expect(codeSlideNode.querySelector('#code_input').value).toBe("");

    slide.updateEditorAndExecuteCode();

    expect(codeSlideNode.querySelector('#code_input').value).toBe("puts 'CODE TO DISPLAY'");

    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', "puts 'CODE TO DISPLAY'", SYNCHRONOUS);	  

  }); 
  
  it("should run code in editor + code to add", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper'><div class='code_to_add'>puts 'CODE TO ADD'</div></div><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></section></div>");
    spyOn(CodeSlide.prototype, 'lastSend').andReturn('');

    var slide = new CodeSlide(codeSlideNode);

    postResource = jasmine.createSpy('postResource').andReturn("CODE TO ADD");

    expect(codeSlideNode.querySelector('#code_input').value).toBe("");
	  
    slide.updateEditorAndExecuteCode();
	  
    expect(codeSlideNode.querySelector('#code_input').value).toBe("");	  

    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', SEPARATOR + "puts 'CODE TO ADD'", SYNCHRONOUS);
	  
    expect(codeSlideNode.querySelector('#code_output').value).toBe("CODE TO ADD");	  

  });	  
  
  it("should NOT display code to add if in last run", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper'><div class='code_to_add'>puts 'CODE TO ADD'</div></div><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></section></div>");
    spyOn(CodeSlide.prototype, 'lastSend').andReturn(SEPARATOR + "puts 'CODE TO ADD'");

    var slide = new CodeSlide(codeSlideNode);
	  
    slide.updateEditorAndExecuteCode();	  

    expect(codeSlideNode.querySelector('#code_input').value).toBe("");

  });  
  
  it("should NOT run code if no last run, no code to display and no code to add", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper' id='code_helper_1'></div></div><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></section><div>");
    spyOn(CodeSlide.prototype, 'lastSend').andReturn('');
	  
    var slide = new CodeSlide(codeSlideNode);
         
    spyOn(CodeSlide.prototype, 'executeCode');       
    spyOn(CodeSlide.prototype, 'updateEditor');       
         
    expect(codeSlideNode.querySelector('#code_input').value).toBe("");

    slide.updateEditorAndExecuteCode();

    expect(codeSlideNode.querySelector('#code_input').value).toBe("");

    expect(CodeSlide.prototype.executeCode).not.toHaveBeenCalled();          
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(0); 
	  
    expect(CodeSlide.prototype.updateEditor).not.toHaveBeenCalled();          
    expect(CodeSlide.prototype.updateEditor.calls.length).toBe(0);	  

  });	  
  
  it("should esacape html caracters in code to add", function() { 

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper'><div class='code_to_add'><<<>>>&&&'''\"\"\"</div></div><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></section></div>");

    var slide = new CodeSlide(codeSlideNode);
	  
    expect(slide.codeToAdd()).toBe(SEPARATOR + "<<<>>>&&&'''\"\"\"");
	  
  });
  
  it("should esacape html caracters in code to display", function() { 

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper'><div class='code_to_display'><<<>>>&&&'''\"\"\"</div></div><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></section></div>");

    var slide = new CodeSlide(codeSlideNode);
	  
    expect(slide.codeToDisplay()).toBe("<<<>>>&&&'''\"\"\"");
	  
  });  
  
});

