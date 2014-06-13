IDE_slide_html = "" +
"<div class='slide'/><section>"+
  "<textarea id='code_input'></textarea>" +
  "<textarea id='code_output'></textarea>"+  
  "<div class='code_helper' id='code_helper_1'></div>"+
  "<div class='code_helper' id='code_helper_2'></div>" +
  "<div class='code_author'><span id='author_name'>author</span></div>" +
  "<input type='button' id='execute'>"+
  "<input type='button' id='send_code'/>"+
  "<input type='button' id='get_code'/>" +
  "<input type='button' id='get_last_send'/>"+
"</section><div>"
    
describe("IDE", function() {

  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);
    IDESlide = new CodeSlide(slideNode);  
  });	
  
  it("should update editor", function() {
	  
   expect(slideNode.querySelector('#code_input').value).toBe('');

   IDESlide.updateEditor("print 'editor updated'");
	  
   expect(slideNode.querySelector('#code_input').value).toBe("print 'editor updated'");
    
  });  

  it("should show code helper", function() {
    
    expect(slideNode.querySelector('#code_helper_1').className).toBe('code_helper');
    expect(slideNode.querySelector('#code_helper_2').className).toBe('code_helper');   
    
    IDESlide.showCodeHelper(0);

    expect(slideNode.querySelector('#code_helper_1').className).toBe('code_helper current');
    expect(slideNode.querySelector('#code_helper_2').className).toBe('code_helper');
	  
    IDESlide.showCodeHelper(1);	

    expect(slideNode.querySelector('#code_helper_1').className).toBe('code_helper');
    expect(slideNode.querySelector('#code_helper_2').className).toBe('code_helper current');  

  });
  
  it("should find last execution", function() {
    
    getResource = jasmine.createSpy('getResource').andReturn('');
	  
    IDESlide.lastExecution();
	  
    expect(getResource).toHaveBeenCalledWith('/code_last_execution/0');
    
  });    
  
}); 

describe("IDE RUN", function() {
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);
    IDESlide = new CodeSlide(slideNode);
    IDESlide.updateEditor("puts 1");
    postResource = jasmine.createSpy('postResource').andReturn('1');
  });
  
  it("should NOT run code when editor is empty", function() {

    IDESlide.updateEditor("");    
    IDESlide.executeCode();

    expect(postResource).not.toHaveBeenCalled();    

  });
  
  it("should run code on server and show result on standard output", function() {
	  
    expect(slideNode.querySelector('#code_input').value).toBe('puts 1');
    expect(slideNode.querySelector('#code_output').value).toBe('');
    expect(postResource.calls.length).toBe(0);	  

    IDESlide.executeCode();
	  
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', 'puts 1', SYNCHRONOUS);
    expect(slideNode.querySelector('#code_input').value).toBe('puts 1');
    expect(slideNode.querySelector('#code_output').value).toBe('1');
    
  });  
  
  it("should run code for current slide only", function() {
	  
    IDESlide.showCodeHelper(0);
    IDESlide.executeCode();

    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', 'puts 1', SYNCHRONOUS);

    IDESlide.showCodeHelper(1);
    IDESlide.executeCode();

    expect(postResource).toHaveBeenCalledWith('/code_run_result/1', 'puts 1', SYNCHRONOUS);    

  });  
  
});  
  
describe("IDE RUN BUTTON", function() {
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);
    IDESlide = new CodeSlide(slideNode);  
    spyOn(CodeSlide.prototype ,"executeCode");
  });  

  it("should run code when RUN BUTTON clicked", function() {
	  
    IDESlide.updateEditor('puts 1');
    slideNode.querySelector('#execute').click();

    expect(CodeSlide.prototype.executeCode.calls.length).toBe(1); 
    
  });
  
  it("should run code when ALT-R pressed", function() {

    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), R, ALT);
	  
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(1);
	  
  });  

  it("should NOT run code when ALT-R disabled", function() {
    
    slideNode.querySelector('#execute').setAttribute("disabled", true);
	  
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), R, ALT);

    expect(CodeSlide.prototype.executeCode.calls.length).toBe(0);  

  });
  
});
  
describe("IDE RUN & SEND", function() {  
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);    
    IDESlide = new CodeSlide(slideNode); 
    IDESlide.updateEditor("puts 1");
    postResource = jasmine.createSpy('postResource').andReturn('1');    
  });	  
  
  it("should NOT send code when editor is empty", function() {

    IDESlide.updateEditor("");    
    IDESlide.executeAndSendCode();

    expect(postResource).not.toHaveBeenCalled();    

  });

  it("should send code on server and show result on standard output", function() {
	  
    expect(slideNode.querySelector('#code_input').value).toBe('puts 1');
    expect(slideNode.querySelector('#code_output').value).toBe('');
    expect(postResource.calls.length).toBe(0);	  

    IDESlide.executeAndSendCode();
	  
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/code_send_result/0', 'puts 1', SYNCHRONOUS);
    expect(slideNode.querySelector('#code_input').value).toBe('puts 1');
    expect(slideNode.querySelector('#code_output').value).toBe('1');
    
  });  
  
  it("should send code for current slide only", function() {
	  
    IDESlide.showCodeHelper(0);
    IDESlide.executeAndSendCode();

    expect(postResource).toHaveBeenCalledWith('/code_send_result/0', 'puts 1', SYNCHRONOUS);

    IDESlide.showCodeHelper(1);
    IDESlide.executeAndSendCode();

    expect(postResource).toHaveBeenCalledWith('/code_send_result/1', 'puts 1', SYNCHRONOUS);    

  });  
  
});  
  
describe("IDE RUN & SEND BUTTON", function() {   
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);
    IDESlide = new CodeSlide(slideNode);  
    spyOn(CodeSlide.prototype ,"executeAndSendCode");
  });

  it("should run and send code when SEND BUTTON clicked", function() {  
    
    IDESlide.updateEditor('puts 1');
    slideNode.querySelector('#send_code').click();

    expect(CodeSlide.prototype.executeAndSendCode.calls.length).toBe(1);     
    
  });  
  
  it("should run and send code when ALT-S pressed", function() {

    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), S, ALT);
	  
    expect(CodeSlide.prototype.executeAndSendCode.calls.length).toBe(1);	  
	  
  }); 

  it("should NOT send code when ALT-S button disabled", function() {

    slideNode.querySelector('#send_code').setAttribute("disabled", true);
	  
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), S, ALT);

    expect(CodeSlide.prototype.executeAndSendCode.calls.length).toBe(0);  

  });
  
});
  
describe("IDE GET & RUN", function() {   
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);    
    IDESlide = new CodeSlide(slideNode);
    spyOn(CodeSlide.prototype ,"executeCode");    
    getResource = jasmine.createSpy('getResource').andReturn('0#|||||#puts 1');
  });
  
  it("should NOT execute code when retreived code is empty", function() {
    
    getResource = jasmine.createSpy('getResource').andReturn('');    
    
    IDESlide.getAndExecuteCode();
    
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(0);    

  });  

  it("should get code and show run result on standard output", function() {
    
    IDESlide.getAndExecuteCode();
    
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(1);    

  });
  
  it("should get code for current slide only", function() {
	  
    IDESlide.showCodeHelper(0);
    IDESlide.getAndExecuteCode();

    expect(getResource).toHaveBeenCalledWith('/code_get_last_send_to_blackboard/0');

    IDESlide.showCodeHelper(1);
    IDESlide.getAndExecuteCode();

    expect(getResource).toHaveBeenCalledWith('/code_get_last_send_to_blackboard/1');    

  });  

});  
  
describe("IDE GET & RUN BUTTON", function() {  
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);
    IDESlide = new CodeSlide(slideNode);  
    spyOn(CodeSlide.prototype ,"getAndExecuteCode");
  });  
  
  it("should run and send code when GET & RUN BUTTON clicked", function() {  
    
    slideNode.querySelector('#get_code').click();

    expect(CodeSlide.prototype.getAndExecuteCode.calls.length).toBe(1);     
    
  });  
  
  it("should get and run last teacher run when ALT-G pressed", function() {
	  
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), G, ALT);

    expect(CodeSlide.prototype.getAndExecuteCode.calls.length).toBe(1);    
	  
  });    
  
  it("should NOT get and run code when ALT-G disabled", function() {
    
    slideNode.querySelector('#get_code').setAttribute("disabled", true);    
	  
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), G, ALT);

    expect(CodeSlide.prototype.getAndExecuteCode.calls.length).toBe(0);  

  });

});
  
describe("IDE LAST SEND", function() {   
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);    
    slide = new CodeSlide(slideNode);  
  });   
  
  it("should get and run last attendee send when ALT-N pressed", function() {
    
    getResource = jasmine.createSpy('getResource').andReturn('attendee_1#|||||#last attendee send code');
    //~ getResource = jasmine.createSpy('getResource').andReturn({"author": 'attendee_1', "code": 'last attendee send code'});
    postResource = jasmine.createSpy('postResource');
	  
    slide._editor.updateEditor('');
	  
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), N, ALT);

    expect(getResource).toHaveBeenCalledWith('/code_attendees_last_send/0');
    expect(postResource).toHaveBeenCalledWith('/code_send_result/0', 'last attendee send code', SYNCHRONOUS);	  
    
    expect(slide._editor.content()).toBe('last attendee send code'); 
	  
  });  
  
  it("should NOT get and run last attendee send when ALT-N button not present", function() {
   
    slideNode = sandbox("<div class='slide'><section><textarea id='code_input'></textarea><textarea class='code_helper'></textarea><textarea class='code_helper'></textarea><input type='button' id='execute'><input type='button' id='send_code'><input type='button' id='get_code' disabled><textarea id='code_output'></textarea></section></div>");
    slide = new CodeSlide(slideNode);  
    
    spyOn(CodeSlide.prototype, '_updateEditorWithLastSendAndExecute');      

    expect(CodeSlide.prototype._updateEditorWithLastSendAndExecute.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), N, ALT);

    expect(CodeSlide.prototype._updateEditorWithLastSendAndExecute.calls.length).toBe(0);  

  });  

});

describe("IDE UPDATE", function() {
	
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html); 
    slide = new CodeSlide(slideNode);  
  });
  
  it("should show current code helper", function() {
	  
    spyOn(CodeSlide.prototype, 'showCodeHelper');	  
	  
    slide._update(0);
	  
    expect(CodeSlide.prototype.showCodeHelper.calls.length).toBe(1);
    expect(CodeSlide.prototype.showCodeHelper).toHaveBeenCalledWith(0);
	  
  });  
  
  it("should run the user last run", function() {

    spyOn(CodeSlide.prototype, 'lastExecution').andReturn({"code": 'last execution', "code_to_add": ''});
	  
    spyOn(CodeSlide.prototype, 'showCodeHelper');	  
    spyOn(CodeSlide.prototype, 'executeCode');
	  
    slide._update(0);

    expect(CodeSlide.prototype.executeCode.calls.length).toBe(1);
	  
  });
  
  it("should NOT run the user last run when code has not changed", function() {

    slide._editor.updateEditor('last execution');
    
    spyOn(CodeSlide.prototype, 'lastExecution').andReturn({"code": 'last execution', "code_to_add": ''});
	  
    spyOn(CodeSlide.prototype, 'executeCode');
	  
    slide._update(0);
	  
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(0);
	  
  });  
  
  it("should NOT run anything when no last run, no code to display and no code to add", function() {

    spyOn(CodeSlide.prototype, 'lastExecution').andReturn({"code": '', "code_to_add": ''});
    
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

    expect(slideNode.querySelector('#code_input').value).toBe('');
    expect(slideNode.querySelector('#code_output').value).toBe('');
    
    getResource = jasmine.createSpy('getResource').andReturn('puts 2');
    postResource = jasmine.createSpy('postResource').andReturn('2');

    slide._update(0);
   
    expect(getResource.calls.length).toBe(1);
    expect(getResource).toHaveBeenCalledWith('/code_last_execution/0');	 

    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', 'puts 2', SYNCHRONOUS);		 

    expect(slideNode.querySelector('#code_input').value).toBe('puts 2');
    expect(slideNode.querySelector('#code_output').value).toBe('2');
    
  });   
  
});

describe("IDE UPDATE with code to DISPLAY in Code Helper", function() {
  
  beforeEach(function () {
    slideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper'><div class='code_to_display'>puts 'CODE TO DISPLAY'</div></div><div class='code_author'>AUTHOR: <span id='author_name'>author</span></div><input type='button' id='execute'/><input type='button' id='send_code'/><input type='button' id='get_code'/><textarea id='code_output'></textarea></section></div>");
  });  
	
  it("should run code to display if no last execution", function() {

    spyOn(CodeSlide.prototype, 'lastExecution').andReturn();
	  
    var slide = new CodeSlide(slideNode);

    postResource = jasmine.createSpy('postResource'); 		  
         
    expect(slideNode.querySelector('#code_input').value).toBe("");

    slide._update(0);

    expect(slideNode.querySelector('#code_input').value).toBe("puts 'CODE TO DISPLAY'");
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', "puts 'CODE TO DISPLAY'", SYNCHRONOUS);	  

  });
  
  it("should run last execution if exists", function() {

    spyOn(CodeSlide.prototype, 'lastExecution').andReturn({"code": "last execution", "code_to_add": ''});
	  
    var slide = new CodeSlide(slideNode);

    postResource = jasmine.createSpy('postResource'); 		  
         
    expect(slideNode.querySelector('#code_input').value).toBe("");

    slide._update(0);

    expect(slideNode.querySelector('#code_input').value).toBe("last execution");
    expect(postResource.calls.length).toBe(1);	  
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', "last execution", SYNCHRONOUS);

  });  

  it("should run code to display once when updated twice", function() {

    spyOn(CodeSlide.prototype, 'lastExecution').andReturn();
	  
    var slide = new CodeSlide(slideNode);

    postResource = jasmine.createSpy('postResource'); 		  
         
    expect(slideNode.querySelector('#code_input').value).toBe("");

    slide._update(0);

    expect(slideNode.querySelector('#code_input').value).toBe("puts 'CODE TO DISPLAY'");
    expect(postResource.calls.length).toBe(1);

    slide._update(0);

    expect(slideNode.querySelector('#code_input').value).toBe("puts 'CODE TO DISPLAY'");    
    expect(postResource.calls.length).toBe(1);

  }); 

});
  
describe("IDE UPDATE with code to ADD in Code Helper", function() {  
  
  beforeEach(function () {
    slideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><div class='code_helper'><div class='code_to_add'>puts 'CODE TO ADD'</div></div><div class='code_author'>AUTHOR: <span id='author_name'>author</span><input type='button' id='execute'/><input type='button' id='send_code'/><input type='button' id='get_code'/><textarea id='code_output'></textarea></section></div>");
   });	  
  
  it("should run code to add", function() {
    
    var slide = new CodeSlide(slideNode);    

    spyOn(CodeSlide.prototype, 'lastExecution').andReturn();

    postResource = jasmine.createSpy('postResource').andReturn("CODE TO ADD");
	  
    slide._update(0);
	  
    expect(slideNode.querySelector('#code_input').value).toBe("");	  
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', SEPARATOR + "puts 'CODE TO ADD'", SYNCHRONOUS);
    expect(slideNode.querySelector('#code_output').value).toBe("CODE TO ADD");  

  });	  
  
  it("should NOT run code if last execution exists with the same code to execute in code editor", function() {

    var slide = new CodeSlide(slideNode);
    
    spyOn(CodeSlide.prototype, 'lastExecution').andReturn({"code": 'code to execute', "code_to_add": 'ADDED CODE'});
    spyOn(CodeSlide.prototype, 'executeCode');

    slide.updateEditor('code to execute');	  
    slide._update(0);

    expect(CodeSlide.prototype.executeCode.calls.length).toBe(0);

  });  
  
  it("should NOT run code if last execution exists and code to execute is empty", function() {

    var slide = new CodeSlide(slideNode);    
    
    spyOn(CodeSlide.prototype, 'lastExecution').andReturn({"code": '', "code_to_add": 'ADDED CODE'});
    spyOn(CodeSlide.prototype, 'executeCode');    
    
    slide.updateEditor('');	  
    slide._update(0);
	  
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(0);    

  });   
  
  it("should NOT display code to add in code editor", function() {

    getResource = jasmine.createSpy('getResource').andReturn(SEPARATOR + "puts 'CODE TO ADD'");

    var slide = new CodeSlide(slideNode);
	  
    expect(slideNode.querySelector('#code_input').value).toBe("");	  
	  
    slide._update(0);	  

    expect(slideNode.querySelector('#code_input').value).toBe("");

  });
  
  //~ it("should NOT display code to add in Teacher code editor when get attendee last Send", function() {

    //~ getResource = jasmine.createSpy('getResource').andReturn('attendee name'+ '#|||||#'+ 'attendee code' +SEPARATOR + "puts 'CODE TO ADD'");

    //~ var slide = new CodeSlide(slideNode);
	  
    //~ expect(slideNode.querySelector('#code_input').value).toBe("");
	  
    //~ slide._update(0, 'teacher');	  

    //~ expect(slideNode.querySelector('#code_input').value).toBe("attendee code");

  //~ });
  
  it("should get last teacher run without code to add", function() {

    getResource = jasmine.createSpy('getResource').andReturn('0#|||||#teacher run' + SEPARATOR + "puts 'CODE TO ADD'");

    var slide = new CodeSlide(slideNode);
	  
    expect(slideNode.querySelector('#code_input').value).toBe("");	  
    
    slide.getAndExecuteCode()

    expect(slideNode.querySelector('#code_input').value).toBe("teacher run");

  });  

});

html_slide = "<div class='slide'/><section>"+
"<textarea id='code_input'></textarea>"+
"<div class='code_helper'>AUTHOR NAME?<input id='attendee_name' type='text'></div>"+
"<div class='code_author'>"+
"AUTHOR: <span id='author_name'>author</span>"+
"<input type='button' id='execute'/>"+
"<input type='button' id='send_code'/>"+
"<input type='button' id='get_code'/>"+
"<input type='button' id='get_last_send'/>"+
"<textarea id='code_output'></textarea>"+
"</section></div>"
 

describe("IDE UPDATE with attendee name to type in", function() {  
  
  beforeEach(function () {
    slideNode = sandbox(html_slide);
   });	  
   
  it("should display session id when initialized", function() {

    getResource = jasmine.createSpy('getResource').andReturn('a name');

    var slide = new CodeSlide(slideNode);
	  
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a name");  

  });
  
  it("should display new name and save new session id when user types a new name", function() {

    getResource = jasmine.createSpy('getResource').andReturn('a name');
    postResource = jasmine.createSpy('postResource')

    var slide = new CodeSlide(slideNode);
    
    slideNode.querySelector('#attendee_name').value = 'a new name';
    
    __triggerKeyboardEvent(slideNode.querySelector('#attendee_name'), RETURN);
    
    expect(postResource).toHaveBeenCalledWith("session_id/attendee_name", "attendee_name=a new name", SYNCHRONOUS);     
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a new name");    

  });
  
  it("should display current session id when teacher execute code", function() {

    getResource = jasmine.createSpy('getResource').andReturn('a name');
    postResource = jasmine.createSpy('postResource')

    var slide = new CodeSlide(slideNode);
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a name");
    
    slideNode.querySelector('#author_name').innerHTML = 'a name to replace';
    
    slide._editor.updateEditor("code to execute");    
    
    slideNode.querySelector('#execute').click();
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a name");    

  }); 
  
  it("should keep new session id when attendee execute code", function() {

    getResource = jasmine.createSpy('getResource').andReturn('a name');
    postResource = jasmine.createSpy('postResource')

    var slide = new CodeSlide(slideNode);
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a name");      
    
    slideNode.querySelector('#attendee_name').value = 'a new name';
    
    __triggerKeyboardEvent(slideNode.querySelector('#attendee_name'), RETURN);
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a new name");  

    slide._editor.updateEditor("code to execute");    
    
    slideNode.querySelector('#execute').click();
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a new name");    

  }); 

  it("should display author id when teacher display last send", function() {

    getResource = jasmine.createSpy('getResource').andReturn('a name');
    postResource = jasmine.createSpy('postResource')
    
    spyOn(CodeSlide.prototype ,"attendeesLastSend").andReturn({author: 'attendee id', code: 'code sent'});

    var slide = new CodeSlide(slideNode);
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a name");
    
    slideNode.querySelector('#get_last_send').click();
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("attendee id");    

  });
  
  it("should display author id when teacher display last send even if last send is the same in editor", function() {

    getResource = jasmine.createSpy('getResource').andReturn('a name');
    postResource = jasmine.createSpy('postResource')
    
    spyOn(CodeSlide.prototype ,"attendeesLastSend").andReturn({author: 'attendee id', code: 'code sent'});

    var slide = new CodeSlide(slideNode);
    
    slideNode.querySelector('#code_input').value = "code sent"
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a name");
    
    slideNode.querySelector('#get_last_send').click();
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("attendee id");

  });  

});   