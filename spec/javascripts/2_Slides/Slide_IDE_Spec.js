describe("IDE", function() {

  beforeEach(function () {
    code_input = "<textarea id='code_input'></textarea>"
    code_helpers = "<textarea class='code_helper' id='code_helper_1'></textarea><textarea class='code_helper' id='code_helper_2'></textarea>"
    author_bar = "<div class='code_author'>AUTHOR: <span id='author_name'>author</span></div>"
    buttons = "<input type='button' id='execute'><input type='button' id='send_code'/><input type='button' id='get_code'/>"
    code_output = "<textarea id='code_output'></textarea>"
    
    codeSlideNode = sandbox("<div class='slide'/><section>" + code_input +  code_helpers + author_bar + buttons + code_output + "</section><div>");
    slide = new CodeSlide(codeSlideNode);  
  });	
  
  it("should update code editor", function() {
	  
   expect(codeSlideNode.querySelector('#code_input').value).toBe('');

   slide._editor.updateEditor("print 'editor updated'");
	  
   expect(codeSlideNode.querySelector('#code_input').value).toBe("print 'editor updated'");
    
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
  
}); 

describe("IDE RUN", function() {
  
  beforeEach(function () {
    code_input = "<textarea id='code_input'></textarea>"
    code_helpers = "<textarea class='code_helper' id='code_helper_1'></textarea><textarea class='code_helper' id='code_helper_2'></textarea>"
    author_bar = "<div class='code_author'>AUTHOR: <span id='author_name'>author</span></div>"
    buttons = "<input type='button' id='execute'><input type='button' id='send_code'/><input type='button' id='get_code'/><input type='button' id='get_last_send'/>"
    code_output = "<textarea id='code_output'></textarea>"
    
    codeSlideNode = sandbox("<div class='slide'/><section>"+code_input+code_helpers+author_bar+buttons+code_output+"</section><div>");
    slide = new CodeSlide(codeSlideNode);  
  });	  
  
  it("should show result on standard output", function() {
  
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
    
    slide._editor.updateEditor('code to run');    

    postResource = jasmine.createSpy('postResource');

    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), R, ALT);
	  
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', 'code to run', SYNCHRONOUS);		  
	  
    slide.showCurrentCodeHelper(1);
	  
    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), R, ALT);	  

    expect(postResource).toHaveBeenCalledWith('/code_run_result/1', 'code to run', SYNCHRONOUS);		  
	  
  });  

  it("should NOT run code when ALT-R disabled", function() {
   
    codeSlideNode = sandbox("<div class='slide'><section><textarea id='code_input'></textarea><textarea class='code_helper'></textarea><textarea class='code_helper'></textarea><input type='button' id='execute' disabled><input type='button' id='send_code'><input type='button' id='get_code'><textarea id='code_output'></textarea></section></div>");
    slide = new CodeSlide(codeSlideNode);  
    
    spyOn(CodeSlide.prototype, 'executeCode');      

    expect(CodeSlide.prototype.executeCode.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), R, ALT);

    expect(CodeSlide.prototype.executeCode.calls.length).toBe(0);  

  });
  
});
  
describe("IDE RUN & SEND", function() {  
  
  beforeEach(function () {
    code_input = "<textarea id='code_input'></textarea>"
    code_helpers = "<textarea class='code_helper' id='code_helper_1'></textarea><textarea class='code_helper' id='code_helper_2'></textarea>"
    author_bar = "<div class='code_author'>AUTHOR: <span id='author_name'>author</span></div>"
    buttons = "<input type='button' id='execute'><input type='button' id='send_code'/><input type='button' id='get_code'/><input type='button' id='get_last_send'/>"
    code_output = "<textarea id='code_output'></textarea>"
    
    codeSlideNode = sandbox("<div class='slide'/><section>"+code_input+code_helpers+author_bar+buttons+code_output+"</section><div>");
    slide = new CodeSlide(codeSlideNode);  
  });	  

  it("should run and send code when send button clicked", function() {

    postResource = jasmine.createSpy('postResource');
	  
    slide._editor.updateEditor('code to send');
	  
    codeSlideNode.querySelector('#send_code').click();

    expect(postResource).toHaveBeenCalledWith('/code_send_result/0', 'code to send', SYNCHRONOUS);	  
    
  });
  
  it("should run and send code when ALT-S pressed", function() {
    
    slide._editor.updateEditor('code to send');     

    postResource = jasmine.createSpy('postResource');

    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), S, ALT);
	  
    expect(postResource).toHaveBeenCalledWith('/code_send_result/0', 'code to send', SYNCHRONOUS);		  
	  
    slide.showCurrentCodeHelper(1);
	  
    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), S, ALT);	  

    expect(postResource).toHaveBeenCalledWith('/code_send_result/1', 'code to send', SYNCHRONOUS);		  
	  
  }); 

  it("should NOT send code when ALT-S button disabled", function() {
   
    codeSlideNode = sandbox("<div class='slide'><section><textarea id='code_input'></textarea><textarea class='code_helper'></textarea><textarea class='code_helper'></textarea><input type='button' id='execute'><input type='button' id='send_code' disabled><input type='button' id='get_code'><textarea id='code_output'></textarea></section></div>");
    slide = new CodeSlide(codeSlideNode);  
    
    spyOn(CodeSlide.prototype, 'executeAndSendCode');      

    expect(CodeSlide.prototype.executeAndSendCode.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), S, ALT);

    expect(CodeSlide.prototype.executeAndSendCode.calls.length).toBe(0);  

  });
  
});
  
describe("IDE GET & RUN", function() {   
  
  beforeEach(function () {
    code_input = "<textarea id='code_input'></textarea>"
    code_helpers = "<textarea class='code_helper' id='code_helper_1'></textarea><textarea class='code_helper' id='code_helper_2'></textarea>"
    author_bar = "<div class='code_author'>AUTHOR: <span id='author_name'>author</span></div>"
    buttons = "<input type='button' id='execute'><input type='button' id='send_code'/><input type='button' id='get_code'/><input type='button' id='get_last_send'/>"
    code_output = "<textarea id='code_output'></textarea>"
    
    codeSlideNode = sandbox("<div class='slide'/><section>"+code_input+code_helpers+author_bar+buttons+code_output+"</section><div>");
    slide = new CodeSlide(codeSlideNode);  
  });  
  
  it("should get and run last teacher run when get button clicked", function() {

    getResource = jasmine.createSpy('getResource').andReturn('0#|||||#last teacher run code');
    postResource = jasmine.createSpy('postResource');
	  
    slide._editor.updateEditor('');
	  
    codeSlideNode.querySelector('#get_code').click();

    expect(getResource).toHaveBeenCalledWith('/code_get_last_send_to_blackboard/0');
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', 'last teacher run code', SYNCHRONOUS);
    
    expect(slide._editor.content()).toBe('last teacher run code');	  
    
  });
  
  it("should get and run last teacher run when ALT-G pressed", function() {
    
    getResource = jasmine.createSpy('getResource').andReturn('0#|||||#last teacher run code');
    postResource = jasmine.createSpy('postResource');
	  
    slide._editor.updateEditor('');
	  
    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), G, ALT);

    expect(getResource).toHaveBeenCalledWith('/code_get_last_send_to_blackboard/0');	  
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', 'last teacher run code', SYNCHRONOUS);	  
    
    expect(slide._editor.content()).toBe('last teacher run code');  
	  
  });    
  
  it("should NOT get and run code when ALT-G disabled", function() {
   
    codeSlideNode = sandbox("<div class='slide'><section><textarea id='code_input'></textarea><textarea class='code_helper'></textarea><textarea class='code_helper'></textarea><input type='button' id='execute'><input type='button' id='send_code'><input type='button' id='get_code' disabled><textarea id='code_output'></textarea></section></div>");
    slide = new CodeSlide(codeSlideNode);  
    
    spyOn(CodeSlide.prototype, 'getAndExecuteCode');      

    expect(CodeSlide.prototype.getAndExecuteCode.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), G, ALT);

    expect(CodeSlide.prototype.getAndExecuteCode.calls.length).toBe(0);  

  });

});
  
describe("IDE LAST SEND", function() {   
  
  beforeEach(function () {
    code_input = "<textarea id='code_input'></textarea>"
    code_helpers = "<textarea class='code_helper' id='code_helper_1'></textarea><textarea class='code_helper' id='code_helper_2'></textarea>"
    author_bar = "<div class='code_author'>AUTHOR: <span id='author_name'>author</span></div>"
    buttons = "<input type='button' id='execute'><input type='button' id='send_code'/><input type='button' id='get_code'/><input type='button' id='get_last_send'/>"
    code_output = "<textarea id='code_output'></textarea>"
    
    codeSlideNode = sandbox("<div class='slide'/><section>"+code_input+code_helpers+author_bar+buttons+code_output+"</section><div>");
    slide = new CodeSlide(codeSlideNode);  
  });   
  
  it("should get and run last attendee send when ALT-N pressed", function() {
    
    getResource = jasmine.createSpy('getResource').andReturn('attendee_1#|||||#last attendee send code');
    postResource = jasmine.createSpy('postResource');
	  
    slide._editor.updateEditor('');
	  
    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), N, ALT);

    expect(getResource).toHaveBeenCalledWith('/code_attendees_last_send/0');
    expect(postResource).toHaveBeenCalledWith('/code_send_result/0', 'last attendee send code', SYNCHRONOUS);	  
    
    expect(slide._editor.content()).toBe('last attendee send code'); 
	  
  });  
  
  it("should NOT get and run last attendee send when ALT-N button not present", function() {
   
    codeSlideNode = sandbox("<div class='slide'><section><textarea id='code_input'></textarea><textarea class='code_helper'></textarea><textarea class='code_helper'></textarea><input type='button' id='execute'><input type='button' id='send_code'><input type='button' id='get_code' disabled><textarea id='code_output'></textarea></section></div>");
    slide = new CodeSlide(codeSlideNode);  
    
    spyOn(CodeSlide.prototype, '_updateEditorWithLastSendAndExecute');      

    expect(CodeSlide.prototype._updateEditorWithLastSendAndExecute.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), N, ALT);

    expect(CodeSlide.prototype._updateEditorWithLastSendAndExecute.calls.length).toBe(0);  

  });  

});

describe("IDE UPDATE", function() {
	
  beforeEach(function () {
    code_input = "<textarea id='code_input'></textarea>"
    code_helpers = "<textarea class='code_helper' id='code_helper_1'></textarea><textarea class='code_helper' id='code_helper_2'></textarea>"
    author_bar = "<div class='code_author'>AUTHOR: <span id='author_name'>author</span></div>"
    buttons = "<input type='button' id='execute'><input type='button' id='send_code'/><input type='button' id='get_code'/>"
    code_output = "<textarea id='code_output'></textarea>"
    
    codeSlideNode = sandbox("<div class='slide'/><section>" + code_input +  code_helpers + author_bar + buttons + code_output + "</section><div>");
    slide = new CodeSlide(codeSlideNode);  
  });
  
  it("should show current code helper", function() {
	  
    spyOn(CodeSlide.prototype, 'showCurrentCodeHelper');	  
	  
    slide._update(0);
	  
    expect(CodeSlide.prototype.showCurrentCodeHelper.calls.length).toBe(1);
    expect(CodeSlide.prototype.showCurrentCodeHelper).toHaveBeenCalledWith(0);
	  
  });  
  
  it("should run the user last run", function() {

    spyOn(CodeSlide.prototype, 'lastExecution').andReturn('last execution');
	  
    spyOn(CodeSlide.prototype, 'showCurrentCodeHelper');	  
    spyOn(CodeSlide.prototype, 'executeCode');
	  
    slide._update(0);
	  
    expect(CodeSlide.prototype.showCurrentCodeHelper.calls.length).toBe(1);
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(1);
	  
  });
  
  it("should NOT run the user last run when code has not changed", function() {

    slide._editor.updateEditor('last execution');
    
    spyOn(CodeSlide.prototype, 'lastExecution').andReturn('last execution');
	  
    spyOn(CodeSlide.prototype, 'executeCode');
	  
    slide._update(0);
	  
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(0);
	  
  });  
  
  it("should NOT run anything when no last run, no code to display and no code to add", function() {

    spyOn(CodeSlide.prototype, 'lastExecution').andReturn('');
    
    slide._editor.updateEditor("print 'code remaining from previous slide'");
    
    postResource = jasmine.createSpy('postResource');
    
    slide._update(0);
    
    expect(postResource.calls.length).toBe(0); 

  });  
  
  it("should show last send attendee name", function() {
	  
    spyOn(CodeSlide.prototype, '_updateLastSendAttendeeName');	  
	  
    slide._update(0);
	  
    expect(CodeSlide.prototype._updateLastSendAttendeeName.calls.length).toBe(1);
	  
  });  
  
  it("should get last execution", function() {

    expect(codeSlideNode.querySelector('#code_input').value).toBe('');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('');
    
    getResource = jasmine.createSpy('getResource').andReturn('puts 2');
    postResource = jasmine.createSpy('postResource').andReturn('2');

    slide._update(0);
   
    expect(getResource.calls.length).toBe(1);
    expect(getResource).toHaveBeenCalledWith('/code_last_execution/0');	 

    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', 'puts 2', SYNCHRONOUS);		 

    expect(codeSlideNode.querySelector('#code_input').value).toBe('puts 2');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('2');
    
  });   
  
});

describe("IDE UPDATE with code to DISPLAY in Code Helper", function() {
  
  beforeEach(function () {
    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper'><div class='code_to_display'>puts 'CODE TO DISPLAY'</div></div><div class='code_author'>AUTHOR: <span id='author_name'>author</span></div><input type='button' id='execute'/><input type='button' id='send_code'/><input type='button' id='get_code'/><textarea id='code_output'></textarea></section></div>");
  });  
	
  it("should run code to display if no last execution", function() {

    spyOn(CodeSlide.prototype, 'lastExecution').andReturn('');
	  
    var slide = new CodeSlide(codeSlideNode);

    postResource = jasmine.createSpy('postResource'); 		  
         
    expect(codeSlideNode.querySelector('#code_input').value).toBe("");

    slide._update(0);

    expect(codeSlideNode.querySelector('#code_input').value).toBe("puts 'CODE TO DISPLAY'");
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', "puts 'CODE TO DISPLAY'", SYNCHRONOUS);	  

  });
  
  it("should run last execution if exists", function() {

    spyOn(CodeSlide.prototype, 'lastExecution').andReturn('code in last execution');
	  
    var slide = new CodeSlide(codeSlideNode);

    postResource = jasmine.createSpy('postResource'); 		  
         
    expect(codeSlideNode.querySelector('#code_input').value).toBe("");

    slide._update(0);

    expect(codeSlideNode.querySelector('#code_input').value).toBe("code in last execution");
    expect(postResource.calls.length).toBe(1);	  
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', "code in last execution", SYNCHRONOUS);

  });  

  it("should run code to display once when updated twice", function() {

    spyOn(CodeSlide.prototype, 'lastExecution').andReturn('');
	  
    var slide = new CodeSlide(codeSlideNode);

    postResource = jasmine.createSpy('postResource'); 		  
         
    expect(codeSlideNode.querySelector('#code_input').value).toBe("");

    slide._update(0);

    expect(codeSlideNode.querySelector('#code_input').value).toBe("puts 'CODE TO DISPLAY'");
    expect(postResource.calls.length).toBe(1);

    slide._update(0);

    expect(codeSlideNode.querySelector('#code_input').value).toBe("puts 'CODE TO DISPLAY'");    
    expect(postResource.calls.length).toBe(1);

  }); 

});
  
describe("IDE UPDATE with code to ADD in Code Helper", function() {  
  
  beforeEach(function () {
    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper'><div class='code_to_add'>puts 'CODE TO ADD'</div></div><div class='code_author'>AUTHOR: <span id='author_name'>author</span><input type='button' id='execute'/><input type='button' id='send_code'/><input type='button' id='get_code'/><textarea id='code_output'></textarea></section></div>");
   });	  
  
  it("should run code to add", function() {

    spyOn(CodeSlide.prototype, 'lastExecution').andReturn('');

    var slide = new CodeSlide(codeSlideNode);

    postResource = jasmine.createSpy('postResource').andReturn("CODE TO ADD");

    expect(codeSlideNode.querySelector('#code_input').value).toBe("");
	  
    slide._update(0);
	  
    expect(codeSlideNode.querySelector('#code_input').value).toBe("");	  
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', SEPARATOR + "puts 'CODE TO ADD'", SYNCHRONOUS);
    expect(codeSlideNode.querySelector('#code_output').value).toBe("CODE TO ADD");	  

  });	  
  
  it("should NOT run code if last execution exists with the same code to execute in code editor", function() {

    getResource = jasmine.createSpy('getResource').andReturn('code to execute' + SEPARATOR + "puts 'CODE TO ADD'");

    var slide = new CodeSlide(codeSlideNode);
    
    slide._editor.updateEditor('code to execute');

    postResource = jasmine.createSpy('postResource');
	  
    slide._update(0);
	  
    expect(postResource.calls.length).toBe(0);

  });  
  
  it("should NOT run code if last execution exists and code to execute is empty", function() {

    getResource = jasmine.createSpy('getResource').andReturn('' + SEPARATOR + "puts 'CODE TO ADD'");

    var slide = new CodeSlide(codeSlideNode);
    
    slide._editor.updateEditor('');

    postResource = jasmine.createSpy('postResource');
	  
    slide._update(0);
	  
    expect(postResource.calls.length).toBe(0);

  });   
  
  it("should NOT display code to add in code editor", function() {

    getResource = jasmine.createSpy('getResource').andReturn(SEPARATOR + "puts 'CODE TO ADD'");

    var slide = new CodeSlide(codeSlideNode);
	  
    expect(codeSlideNode.querySelector('#code_input').value).toBe("");	  
	  
    slide._update(0);	  

    expect(codeSlideNode.querySelector('#code_input').value).toBe("");

  });
  
  //~ it("should NOT display code to add in Teacher code editor when get attendee last Send", function() {

    //~ getResource = jasmine.createSpy('getResource').andReturn('attendee name'+ '#|||||#'+ 'attendee code' +SEPARATOR + "puts 'CODE TO ADD'");

    //~ var slide = new CodeSlide(codeSlideNode);
	  
    //~ expect(codeSlideNode.querySelector('#code_input').value).toBe("");
	  
    //~ slide._update(0, 'teacher');	  

    //~ expect(codeSlideNode.querySelector('#code_input').value).toBe("attendee code");

  //~ });
  
  it("should get last teacher run without code to add", function() {

    getResource = jasmine.createSpy('getResource').andReturn('0#|||||#teacher run' + SEPARATOR + "puts 'CODE TO ADD'");

    var slide = new CodeSlide(codeSlideNode);
	  
    expect(codeSlideNode.querySelector('#code_input').value).toBe("");	  
    
    slide.getAndExecuteCode()

    expect(codeSlideNode.querySelector('#code_input').value).toBe("teacher run");

  });  

});


describe("IDE UPDATE with attendee name to type in", function() {  
  
  beforeEach(function () {
    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper'>AUTHOR NAME?<input id='attendee_name' type='text'></div><div class='code_author'>AUTHOR: <span id='author_name'>author</span><input type='button' id='execute'/><input type='button' id='send_code'/><input type='button' id='get_code'/><input type='button' id='get_last_send'/><textarea id='code_output'></textarea></section></div>");
   });	  
   
  it("should display session id when initialized", function() {

    getResource = jasmine.createSpy('getResource').andReturn('a name');

    var slide = new CodeSlide(codeSlideNode);
	  
    expect(codeSlideNode.querySelector('#author_name').innerHTML).toBe("a name");  

  });
  
  it("should display new name and save new session id when user types a new name", function() {

    getResource = jasmine.createSpy('getResource').andReturn('a name');
    postResource = jasmine.createSpy('postResource')

    var slide = new CodeSlide(codeSlideNode);
    
    codeSlideNode.querySelector('#attendee_name').value = 'a new name';
    
    __triggerKeyboardEvent(codeSlideNode.querySelector('#attendee_name'), RETURN);
    
    expect(postResource).toHaveBeenCalledWith("session_id/attendee_name", "attendee_name=a new name", SYNCHRONOUS);     
    
    expect(codeSlideNode.querySelector('#author_name').innerHTML).toBe("a new name");    

  });
  
  it("should display current session id when teacher execute code", function() {

    getResource = jasmine.createSpy('getResource').andReturn('a name');
    postResource = jasmine.createSpy('postResource')

    var slide = new CodeSlide(codeSlideNode);
    
    expect(codeSlideNode.querySelector('#author_name').innerHTML).toBe("a name");
    
    codeSlideNode.querySelector('#author_name').innerHTML = 'a name to replace';
    
    slide._editor.updateEditor("code to execute");    
    
    codeSlideNode.querySelector('#execute').click();
    
    expect(codeSlideNode.querySelector('#author_name').innerHTML).toBe("a name");    

  }); 
  
  it("should keep new session id when attendee execute code", function() {

    getResource = jasmine.createSpy('getResource').andReturn('a name');
    postResource = jasmine.createSpy('postResource')

    var slide = new CodeSlide(codeSlideNode);
    
    expect(codeSlideNode.querySelector('#author_name').innerHTML).toBe("a name");      
    
    codeSlideNode.querySelector('#attendee_name').value = 'a new name';
    
    __triggerKeyboardEvent(codeSlideNode.querySelector('#attendee_name'), RETURN);
    
    expect(codeSlideNode.querySelector('#author_name').innerHTML).toBe("a new name");  

    slide._editor.updateEditor("code to execute");    
    
    codeSlideNode.querySelector('#execute').click();
    
    expect(codeSlideNode.querySelector('#author_name').innerHTML).toBe("a new name");    

  }); 

  it("should display author id when teacher display last send", function() {

    getResource = jasmine.createSpy('getResource').andReturn('a name');
    postResource = jasmine.createSpy('postResource')
    
    spyOn(CodeSlide.prototype ,"attendeesLastSend").andReturn("attendee id#|||||#code sent");

    var slide = new CodeSlide(codeSlideNode);
    
    expect(codeSlideNode.querySelector('#author_name').innerHTML).toBe("a name");
    
    codeSlideNode.querySelector('#get_last_send').click();
    
    expect(codeSlideNode.querySelector('#author_name').innerHTML).toBe("attendee id");    

  });
  
  it("should display author id when teacher display last send even if last send is the same in editor", function() {

    getResource = jasmine.createSpy('getResource').andReturn('a name');
    postResource = jasmine.createSpy('postResource')
    
    spyOn(CodeSlide.prototype ,"attendeesLastSend").andReturn("attendee id#|||||#code sent");

    var slide = new CodeSlide(codeSlideNode);
    
    codeSlideNode.querySelector('#code_input').value = "code sent"
    
    expect(codeSlideNode.querySelector('#author_name').innerHTML).toBe("a name");
    
    codeSlideNode.querySelector('#get_last_send').click();
    
    expect(codeSlideNode.querySelector('#author_name').innerHTML).toBe("attendee id");

  });  

});   