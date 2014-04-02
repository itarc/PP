describe("IDE", function() {
	
  beforeEach(function () {
    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><textarea class='code_helper' id='code_helper_1'></textarea><textarea class='code_helper' id='code_helper_2'></textarea><input type='button' id='execute'><input type='button' id='send_code'/><textarea id='code_output'></textarea></section><div>");
    slide = new CodeSlide(codeSlideNode);  
  });	

  it("should show current code_helper", function() {
    
    expect(codeSlideNode.querySelector('#code_helper_1').className).toBe('code_helper');
    expect(codeSlideNode.querySelector('#code_helper_2').className).toBe('code_helper');   
    
    slide.showCurrentCodeHelper(0);

    expect(codeSlideNode.querySelector('#code_helper_1').className).toBe('code_helper current');
    expect(codeSlideNode.querySelector('#code_helper_2').className).toBe('code_helper');
	  
    slide.showCurrentCodeHelper(1);	

    expect(codeSlideNode.querySelector('#code_helper_1').className).toBe('code_helper');
    expect(codeSlideNode.querySelector('#code_helper_2').className).toBe('code_helper current');  

  });
	
  it("should update code editor", function() {
	  
   expect(codeSlideNode.querySelector('#code_input').value).toBe('');

   slide._editor.updateEditor("print 'editor updated'");
	  
   expect(codeSlideNode.querySelector('#code_input').value).toBe("print 'editor updated'");
    
  });
  
  it("should show current helper and run current code when updated", function() {
	  
    spyOn(CodeSlide.prototype, 'showCurrentCodeHelper');	  
    spyOn(CodeSlide.prototype, 'updateEditorAndExecuteCode');
	  
    slide._update();
	  
    expect(CodeSlide.prototype.showCurrentCodeHelper.calls.length).toBe(1);
    expect(CodeSlide.prototype.updateEditorAndExecuteCode.calls.length).toBe(1);
	  
  });
  
});  

describe("IDE RUN", function() {
  
  beforeEach(function () {
    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><textarea class='code_helper' id='code_helper_1'></textarea><textarea class='code_helper' id='code_helper_2'></textarea><input type='button' id='execute'><input type='button' id='send_code'/><textarea id='code_output'></textarea></section><div>");
    slide = new CodeSlide(codeSlideNode);  
  });	  
  
  it("should display run result on standard output", function() {
  
    postResource = jasmine.createSpy('postResource').andReturn('1');  
	  
    slide._editor.updateEditor('puts 1');
	  
    expect(codeSlideNode.querySelector('#code_input').value).toBe('puts 1');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('');
    expect(postResource.calls.length).toBe(0);	  

    slide.executeCode();  
	  
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', 'puts 1', SYNCHRONOUS);
    expect(codeSlideNode.querySelector('#code_input').value).toBe('puts 1');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('1');
    
  });  

  it("should run code when run button clicked", function() {
  
    postResource = jasmine.createSpy('postResource');
	  
    slide._editor.updateEditor('puts 1');	  
	  
    codeSlideNode.querySelector('#execute').click();

    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', 'puts 1', SYNCHRONOUS);	  
    
  });
  
  it("should run code when ALT-R pressed", function() {

    postResource = jasmine.createSpy('postResource');

    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), R, ALT);
	  
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', '', SYNCHRONOUS);		  
	  
    slide.showCurrentCodeHelper(1);
	  
    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), R, ALT);	  

    expect(postResource).toHaveBeenCalledWith('/code_run_result/1', '', SYNCHRONOUS);		  
	  
  });   

  it("should run and send code when send button clicked", function() {

    postResource = jasmine.createSpy('postResource');
	  
    slide._editor.updateEditor('puts 1');
	  
    codeSlideNode.querySelector('#send_code').click();

    expect(postResource).toHaveBeenCalledWith('/code_send_result/0', 'puts 1', SYNCHRONOUS);	  
    
  });
  
  it("should run and send code when ALT-S pressed", function() {

    postResource = jasmine.createSpy('postResource');

    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), S, ALT);
	  
    expect(postResource).toHaveBeenCalledWith('/code_send_result/0', '', SYNCHRONOUS);		  
	  
    slide.showCurrentCodeHelper(1);
	  
    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), S, ALT);	  

    expect(postResource).toHaveBeenCalledWith('/code_send_result/1', '', SYNCHRONOUS);		  
	  
  });  
  
  it("should get and run last send if exist", function() {

    expect(codeSlideNode.querySelector('#code_input').value).toBe('');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('');
    
    getResource = jasmine.createSpy('getResource').andReturn('puts 2');
    postResource = jasmine.createSpy('postResource').andReturn('2');

    slide.updateEditorAndExecuteCode();
   
    expect(getResource.calls.length).toBe(1);
    expect(getResource).toHaveBeenCalledWith('/code_last_send/0');	 

    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', 'puts 2', SYNCHRONOUS);		 

    expect(codeSlideNode.querySelector('#code_input').value).toBe('puts 2');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('2');
    
  }); 

  it("should NOT run code if no last run, no code to display and no code to add", function() {

    spyOn(CodeSlide.prototype, 'lastSend').andReturn('');
         
    spyOn(CodeSlide.prototype, 'executeCode');       
    spyOn(Editor.prototype, 'updateEditor');       
         
    expect(codeSlideNode.querySelector('#code_input').value).toBe("");
    
    slide.updateEditorAndExecuteCode();

    expect(codeSlideNode.querySelector('#code_input').value).toBe("");
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(0);
    expect(Editor.prototype.updateEditor.calls.length).toBe(0);  

  });  

});

describe("IDE RUN with code to DISPLAY in Code Helper", function() {
	
  it("should run code to display if no last send", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper'><div class='code_to_display'>puts 'CODE TO DISPLAY'</div></div><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></section></div>");
    spyOn(CodeSlide.prototype, 'lastSend').andReturn('');
	  
    var slide = new CodeSlide(codeSlideNode);

    postResource = jasmine.createSpy('postResource'); 		  
         
    expect(codeSlideNode.querySelector('#code_input').value).toBe("");

    slide.updateEditorAndExecuteCode();

    expect(codeSlideNode.querySelector('#code_input').value).toBe("puts 'CODE TO DISPLAY'");
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', "puts 'CODE TO DISPLAY'", SYNCHRONOUS);	  

  });
  
  it("should run last send if last send exists", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper'><div class='code_to_display'>puts 'CODE TO DISPLAY'</div></div><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></section></div>");
    spyOn(CodeSlide.prototype, 'lastSend').andReturn('code in last send');
	  
    var slide = new CodeSlide(codeSlideNode);

    postResource = jasmine.createSpy('postResource'); 		  
         
    expect(codeSlideNode.querySelector('#code_input').value).toBe("");

    slide.updateEditorAndExecuteCode();

    expect(codeSlideNode.querySelector('#code_input').value).toBe("code in last send");
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', "code in last send", SYNCHRONOUS);	  

  });  

});
  
describe("IDE RUN with code to ADD in Code Helper", function() {  
  
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
  
  it("should NOT display code to add in code editor", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper'><div class='code_to_add'>puts 'CODE TO ADD'</div></div><input type='button' id='execute'/><input type='button' id='send_code'/><textarea id='code_output'></textarea></section></div>");
    spyOn(CodeSlide.prototype, 'lastSend').andReturn(SEPARATOR + "puts 'CODE TO ADD'");

    var slide = new CodeSlide(codeSlideNode);
	  
    expect(codeSlideNode.querySelector('#code_input').value).toBe("");	  
	  
    slide.updateEditorAndExecuteCode();	  

    expect(codeSlideNode.querySelector('#code_input').value).toBe("");

  });

});