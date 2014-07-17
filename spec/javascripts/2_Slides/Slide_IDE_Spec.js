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

IDE_slide_html =  
HEADER + 
code_input + 
code_helpers +
author_bar +
buttons + 
code_ouput + 
FOOTER

describe("Server Execution Context", function() {

  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);
    IDESlide = new CodeSlide(slideNode);  
    executionContext = new ServerExecutionContext(IDESlide);
    getResource = jasmine.createSpy('getResource').andReturn('server_author' + SEPARATOR + 'server_code' + SEPARATOR + 'server_code to add');    
  });
  
  it("should get a JSON format", function() {	 
    jsonContext = executionContext.getContextOnServer('/url')  
    
    expect(jsonContext.author).toBe('server_author');
    expect(jsonContext.code).toBe('server_code');
    expect(jsonContext.code_to_add).toBe('server_code to add');
  });    
  
  it("should be update with a resource", function() {
    executionContext.updateWithResource('/url');
	  
    expect(executionContext.author).toBe('server_author');
    expect(executionContext.code).toBe('server_code');
    expect(executionContext.code_to_add).toBe('server_code to add');
  });  
  
});


describe("IDE EDITOR", function() {
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);
    IDESlide = new CodeSlide(slideNode);  
  });	
  
  it("should be empty when IDE initialized", function() {
   expect(slideNode.querySelector('#code_input').value).toBe('');
  });   
  
  it("should be filled when updated", function() {
   IDESlide._editor.updateWithText("CODE");
	  
   expect(slideNode.querySelector('#code_input').value).toBe("CODE");
  });  
  
});

describe("IDE STANDARD OUTPUT", function() {
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);
    IDESlide = new CodeSlide(slideNode);  
  });	
  
  it("should be empty when IDE initialized", function() {
   expect(slideNode.querySelector('#code_output').value).toBe('');
  });  
  
  it("should be filled when updated", function() {
   IDESlide._standardOuput.updateWith("CODE RESULT");
	  
   expect(slideNode.querySelector('#code_output').value).toBe("CODE RESULT");
  });   
  
});

describe("IDE CODE HELPERS", function() {

  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);
    IDESlide = new CodeSlide(slideNode);  
  });

  it("should show the right code helper", function() {
    expect(slideNode.querySelector('#code_helper_1').className).toBe('code_helper');
    expect(slideNode.querySelector('#code_helper_2').className).toBe('code_helper');   
    
    IDESlide.showCodeHelper(0);

    expect(slideNode.querySelector('#code_helper_1').className).toBe('code_helper current');
    expect(slideNode.querySelector('#code_helper_2').className).toBe('code_helper');
	  
    IDESlide.showCodeHelper(1);	

    expect(slideNode.querySelector('#code_helper_1').className).toBe('code_helper');
    expect(slideNode.querySelector('#code_helper_2').className).toBe('code_helper current');  
  });
  
}); 

describe("IDE EXECUTE AT", function() {
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);
    IDESlide = new CodeSlide(slideNode);
    postResource = jasmine.createSpy('postResource').andReturn('1');
  });

  it("should NOT be called when IDE is initialized", function() {
    expect(postResource.calls.length).toBe(0);   
  });  
  
  it("should NOT execute code when editor is empty", function() {
    IDESlide._editor.updateWithText("");
    
    IDESlide.executeCodeAt('/url');

    expect(postResource).not.toHaveBeenCalled();    
  });
  
  it("should execute code on server and show result on standard output", function() {
    IDESlide._editor.updateWithText("CODE");    

    IDESlide.executeCodeAt('/url');
	  
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/url/0', 'CODE', SYNCHRONOUS);
    expect(slideNode.querySelector('#code_input').value).toBe('CODE');
    expect(slideNode.querySelector('#code_output').value).toBe('1');
  });  
  
  it("should execute code for current slide only", function() {
    IDESlide._editor.updateWithText("CODE");
    
    IDESlide.showCodeHelper(0);
    IDESlide.executeCodeAt('/url');

    expect(postResource).toHaveBeenCalledWith('/url/0', 'CODE', SYNCHRONOUS);

    IDESlide.showCodeHelper(1);
    IDESlide.executeCodeAt('/url');

    expect(postResource).toHaveBeenCalledWith('/url/1', 'CODE', SYNCHRONOUS);    
  });  
  
}); 

describe("IDE RUN", function() {
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);
    IDESlide = new CodeSlide(slideNode);
    IDESlide._editor.updateWithText("CODE TO RUN");
  });
  
  it("should run code at RUN URL", function() {
    IDESlide.executeCode();
	  
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', 'CODE TO RUN', SYNCHRONOUS);
  }); 
  
});  
  
describe("IDE RUN BUTTON", function() {
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);
    IDESlide = new CodeSlide(slideNode);  
    IDESlide._editor.updateWithText('CODE TO RUN WITH A BUTTON');
    spyOn(CodeSlide.prototype ,"executeCode");
  });  

  it("should run code when RUN BUTTON clicked", function() {
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
    IDESlide._editor.updateWithText("CODE TO RUN & SEND");
  });
  
  it("should run code & send at SEND URL", function() {
    IDESlide.executeAndSendCode();
	  
    expect(postResource).toHaveBeenCalledWith('/code_send_result/0', 'CODE TO RUN & SEND', SYNCHRONOUS);
  });
  
});  
  
describe("IDE RUN & SEND BUTTON", function() {   
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);
    IDESlide = new CodeSlide(slideNode);
    IDESlide._editor.updateWithText('CODE TO RUN & SEND WITH A BUTTON');    
    spyOn(CodeSlide.prototype ,"executeAndSendCode");
  });

  it("should run and send code when SEND BUTTON clicked", function() {  
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
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({"author": '', "code": 'LAST SEND TO BLACKBOARD', "code_to_add": ''});    
  });
  
  it("should run last send to blackboard", function() {
    IDESlide.getAndExecuteCode();
    
    expect(ServerExecutionContext.prototype.getContextOnServer).toHaveBeenCalledWith('/code_get_last_send_to_blackboard/0');   
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(1);    
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
  
describe("TEACHER IDE GET LAST SEND", function() {   
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);    
    slide = new CodeSlide(slideNode);  
    spyOn(CodeSlide.prototype, '_updateEditorWithLastSendAndExecute');    
  });   
  
  it("should get and run last attendee send when ALT-N pressed", function() {
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), N, ALT);
    
    expect(CodeSlide.prototype._updateEditorWithLastSendAndExecute.calls.length).toBe(1);      	  
  });  
  
  it("should NOT get and run last attendee send when ALT-N button not present", function() {
    slideNode.querySelector('section').removeChild(slideNode.querySelector('section').querySelector('#get_last_send'));
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
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({"author": '', "code": 'last execution', "code_to_add": ''});
    spyOn(CodeSlide.prototype, 'executeCode');

    slide._update(0);

    expect(ServerExecutionContext.prototype.getContextOnServer).toHaveBeenCalledWith('/code_last_execution/0');
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(1);
  });
  
  it("should NOT run the user last run when code has not changed", function() {

    slide._editor.updateWithText('last execution');
    
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({"author": '', "code": 'last execution', "code_to_add": ''});
	  
    spyOn(CodeSlide.prototype, 'executeCode');
	  
    slide._update(0);
	  
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(0);
	  
  });  
  
  it("should NOT run anything when no last run, no code to display and no code to add", function() {

    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({"author": '', "code": '', "code_to_add": ''});    
    
    slide._editor.updateWithText("print 'code remaining from previous slide'");
    
    postResource = jasmine.createSpy('postResource');
    
    slide._update(0);
    
    expect(postResource.calls.length).toBe(0); 

  });  

}); 

IDE_slide_with_code_to_display_html =  
HEADER + 
code_input + 
"<div class='code_helper'>"+
"<div class='code_to_display'>puts 'CODE TO DISPLAY'</div>"+
"</div>"+
author_bar +
buttons + 
code_ouput + 
FOOTER

describe("IDE UPDATE with code to DISPLAY in Code Helper", function() {
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_with_code_to_display_html);
  });  
	
  it("should run code to display if no last execution", function() {

    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({"author": '', "code": '', "code_to_add": ''});    
	  
    var slide = new CodeSlide(slideNode);
	
    spyOn(CodeSlide.prototype, 'executeCode');    

    expect(slideNode.querySelector('#code_input').value).toBe("");

    slide._update(0);

    expect(slideNode.querySelector('#code_input').value).toBe("puts 'CODE TO DISPLAY'");
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(1);

  });
  
  it("should run last execution if exists", function() {

    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({"author": '', "code": 'last execution', "code_to_add": ''});    
	  
    var slide = new CodeSlide(slideNode);		

    spyOn(CodeSlide.prototype, 'executeCode');

    expect(slideNode.querySelector('#code_input').value).toBe("");

    slide._update(0);

    expect(slideNode.querySelector('#code_input').value).toBe("last execution");
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(1);	  

  });  

  it("should NOT run code that is already in editor", function() {

    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({"author": '', "code": '', "code_to_add": ''});
	  
    var slide = new CodeSlide(slideNode);

    spyOn(CodeSlide.prototype, 'executeCode');    

    expect(slideNode.querySelector('#code_input').value).toBe("");

    slide._update(0);

    expect(slideNode.querySelector('#code_input').value).toBe("puts 'CODE TO DISPLAY'");
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(1);	

    slide._update(0);

    expect(slideNode.querySelector('#code_input').value).toBe("puts 'CODE TO DISPLAY'");    
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(1);	

  }); 

});

IDE_slide_with_code_to_add_html =  
HEADER + 
code_input + 
"<div class='code_helper'>"+
"<div class='code_to_add'>puts 'CODE TO ADD'</div>"+
"</div>"+
author_bar +
buttons + 
code_ouput + 
FOOTER
  
describe("IDE UPDATE with code to ADD in Code Helper", function() {  
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_with_code_to_add_html);
    slide = new CodeSlide(slideNode);   
   });	  
  
  it("should run code to add", function() {
    
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({"author": '', "code": '', "code_to_add": ''});

    postResource = jasmine.createSpy('postResource').andReturn("CODE TO ADD");

    slide._update(0);
	  
    expect(slideNode.querySelector('#code_input').value).toBe("");	  
    expect(postResource).toHaveBeenCalledWith('/code_run_result/0', SEPARATOR + "puts 'CODE TO ADD'", SYNCHRONOUS);
    expect(slideNode.querySelector('#code_output').value).toBe("CODE TO ADD");  

  });	  
  
  it("should NOT run code that is already in editor", function() {
    
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({"author": '', "code": 'code to execute', "code_to_add": "puts 'CODE TO ADD'" });
    spyOn(CodeSlide.prototype, 'executeCode');

    slide._editor.updateWithText('code to execute');	  
    slide._update(0);

    expect(CodeSlide.prototype.executeCode.calls.length).toBe(0);

  });  
  
  //~ it("should NOT run code if last execution exists and code to execute is empty", function() {

    //~ var slide = new CodeSlide(slideNode);    
    
    //~ spyOn(CodeSlide.prototype, 'lastExecution').andReturn({"author": '', "code": '', "code_to_add": 'ADDED CODE'});
    //~ spyOn(CodeSlide.prototype, 'executeCode');    
    
    //~ slide._editor.updateWithText('');
    //~ slide._update(0);
	  
    //~ expect(CodeSlide.prototype.executeCode.calls.length).toBe(0);    

  //~ });   
  
  it("should NOT display code to add in code editor", function() {

    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({"author": '', "code": '', "code_to_add": "puts 'CODE TO ADD'" });
    
    var slide = new CodeSlide(slideNode);
	  
    expect(slideNode.querySelector('#code_input').value).toBe("");	  
	  
    slide._update(0);	  

    expect(slideNode.querySelector('#code_input').value).toBe("");

  });
  
  //~ it("should NOT display code to add in Teacher code editor when get attendee last Send", function() {

    //~ getResource = jasmine.createSpy('getResource').andReturn('attendee name'+ '' + SEPARATOR + ''+ 'attendee code' +SEPARATOR + "puts 'CODE TO ADD'");

    //~ var slide = new CodeSlide(slideNode);
	  
    //~ expect(slideNode.querySelector('#code_input').value).toBe("");
	  
    //~ slide._update(0, 'teacher');	  

    //~ expect(slideNode.querySelector('#code_input').value).toBe("attendee code");

  //~ });
  
  it("should get last teacher run without code to add", function() {

    getResource = jasmine.createSpy('getResource').andReturn('0' + SEPARATOR + 'teacher run' + SEPARATOR + "puts 'CODE TO ADD'");
	  
    expect(slideNode.querySelector('#code_input').value).toBe("");	  
    
    slide.getAndExecuteCode()

    expect(slideNode.querySelector('#code_input').value).toBe("teacher run");

  });  

});
 
IDE_slide_with_attendee_name_field_html =  
HEADER + 
code_input + 
"<div class='code_helper'>AUTHOR NAME?<input id='attendee_name' type='text'></div>"+
author_bar +
buttons + 
code_ouput + 
FOOTER

describe("IDE UPDATE with attendee name to type in", function() {  
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_with_attendee_name_field_html);
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
    
    slide._editor.updateWithText("code to execute");    
    
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

    slide._editor.updateWithText("code to execute");    
    
    slideNode.querySelector('#execute').click();
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a new name");    

  }); 

});  

IDE_slide_with_attendee_name =  
HEADER + 
code_input + 
code_helpers +
author_bar +
buttons + 
"<input type='button' id='get_last_send'/>"+
code_ouput + 
FOOTER

describe("IDE UPDATE with attendee name", function() {  
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_with_attendee_name);
   });	
   
  it("should display author id when teacher display last send", function() {

    getResource = jasmine.createSpy('getResource').andReturn('a name');
    postResource = jasmine.createSpy('postResource')
    
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({author: 'attendee id', code: 'code sent'});     

    var slide = new CodeSlide(slideNode);
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a name");
    
    slideNode.querySelector('#get_last_send').click();
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("attendee id");    

  });
  
  it("should display author id when teacher display last send even if last send is the same in editor", function() {

    getResource = jasmine.createSpy('getResource').andReturn('a name');
    postResource = jasmine.createSpy('postResource')
    
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({author: 'attendee id', code: 'code sent'});       

    var slide = new CodeSlide(slideNode);
    
    slideNode.querySelector('#code_input').value = "code sent"
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a name");
    
    slideNode.querySelector('#get_last_send').click();
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("attendee id");

  });   

});   

IDE_slide_with_last_send_attendee_name_html =  
HEADER + 
code_input + 
code_helpers + 
"<div class='code_author'>"+
"LAST ATTENDEE NAME: <span id='last_send_attendee_name'></span>"+
"AUTHOR NAME <span id='author_name'></span>"+
"</div>" +
buttons + 
code_ouput + 
FOOTER


describe("TEACHER IDE", function() {  
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_with_last_send_attendee_name_html);
    slide = new TeacherCodeSlide(slideNode);    
   });	 
   
  it("should show last send attendee name when upated", function() {
    spyOn(TeacherCodeSlide.prototype, '_updateLastSendAttendeeName');	  
	  
    slide._update(0);
	  
    expect(TeacherCodeSlide.prototype._updateLastSendAttendeeName.calls.length).toBe(1);
  });     
   
   
  it("should display last send attendee name", function() {
    getResource = jasmine.createSpy('getResource').andReturn('a name');
    
    slide._updateLastSendAttendeeName();
    
    expect(slideNode.querySelector('#last_send_attendee_name').innerHTML.replace(/&gt;/g, '>')).toBe("a name >> "); 
  });   
   
});     