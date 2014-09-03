FULL_IDE_SLIDE =  
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

describe("Server Execution Context", function() {

  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);
    IDESlide = new CodeSlide(slideNode);  
    executionContext = new ServerExecutionContext(IDESlide);  
    spyOn(Resource.prototype, "get").andReturn("{\"author\": \"server_author\", \"type\": \"run_type\", \"code\": \"server_code\", \"code_to_add\": \"server_code to add\"}");
  });
  
  it("should format server response to JSON", function() {	 
    jsonContext = executionContext.getContextOnServer('/url')  
    
    expect(jsonContext.author).toBe('server_author');
    expect(jsonContext.code).toBe('server_code');
    expect(jsonContext.code_to_add).toBe('server_code to add');
  });    
  
  it("should be updated with a resource", function() {
    executionContext.updateWithResource('/url');
	  
    expect(executionContext.author).toBe('server_author');
    expect(executionContext.type).toBe('run_type');
    expect(executionContext.code).toBe('server_code');
    expect(executionContext.code_to_add).toBe('server_code to add');
  });  
  
}); 

describe("IDE SAVE CURRENT EXECUTION CONTEXT", function() {
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE); 
    IDESlide = new CodeSlide(slideNode, new SlideShow([]));
    IDESlide._saveURL = '/save_url'
    spyOn(Resource.prototype, 'post');
  });

  it("should save code for current slide", function() {
    IDESlide._editor.updateWithText("CODE");
    
    IDESlide._codeHelpers._currentIndex = 0;
    IDESlide._save('run');

    expect(Resource.prototype.post).toHaveBeenCalledWith(IDESlide._saveURL + "/0", '{"type":"run","code":"CODE","code_output":""}', SYNCHRONOUS);

    IDESlide._codeHelpers._currentIndex = 1;      
    IDESlide._save('run');

    expect(Resource.prototype.post).toHaveBeenCalledWith(IDESlide._saveURL + "/0", '{"type":"run","code":"CODE","code_output":""}', SYNCHRONOUS);  
  });

});

describe("IDE RUN CODE", function() {
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);
    IDESlide = new CodeSlide(slideNode, new SlideShow([]));
    spyOn(Resource.prototype, 'post').andReturn('EXECUTION RESULT');
  });  
  
  it("should NOT run code when editor is empty", function() {
    IDESlide._editor.updateWithText("");
    
    IDESlide.run();

    expect(Resource.prototype.post).not.toHaveBeenCalledWith(IDESlide._runResource);    
    expect(Resource.prototype.post).not.toHaveBeenCalledWith(IDESlide._saveURL + '/0', '{"type":"run","code":"","code_output":"EXECUTION RESULT"}', false);    
  });
  
  it("should run code and display result on standard output", function() {
    IDESlide._editor.updateWithText("CODE");    

    IDESlide.run();

    expect(Resource.prototype.post).toHaveBeenCalledWith(IDESlide._runResource, "CODE", SYNCHRONOUS);    
    expect(Resource.prototype.post).toHaveBeenCalledWith(IDESlide._saveURL + '/0', '{"type":"run","code":"CODE","code_output":"EXECUTION RESULT"}', false);    

    expect(slideNode.querySelector('#code_input').value).toBe('CODE');
    expect(slideNode.querySelector('#code_output').value).toBe('EXECUTION RESULT');
  });  
  
});

describe("IDE SEND CODE", function() {
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);
    IDESlide = new CodeSlide(slideNode, new SlideShow([]));
    spyOn(Resource.prototype, 'post').andReturn('EXECUTION RESULT');
  });  
  
  it("should NOT run code when editor is empty", function() {
    IDESlide._editor.updateWithText("");
    
    IDESlide.runAndSend();

    expect(Resource.prototype.post).not.toHaveBeenCalledWith(IDESlide._runResource);    
    expect(Resource.prototype.post).not.toHaveBeenCalledWith(IDESlide._saveURL + '/0', '{"type":"send","code":"","code_output":"EXECUTION RESULT"}', false);    
  });
  
  it("should run code and display result on standard output", function() {
    IDESlide._editor.updateWithText("CODE");    

    IDESlide.runAndSend();

    expect(Resource.prototype.post).toHaveBeenCalledWith(IDESlide._runResource, "CODE", SYNCHRONOUS);    
    expect(Resource.prototype.post).toHaveBeenCalledWith(IDESlide._saveURL + '/0', '{"type":"send","code":"CODE","code_output":"EXECUTION RESULT"}', false);    

    expect(slideNode.querySelector('#code_input').value).toBe('CODE');
    expect(slideNode.querySelector('#code_output').value).toBe('EXECUTION RESULT');
  });  
  
});

describe("IDE GET AND RUN CODE", function() {
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);
    IDESlide = new CodeSlide(slideNode, new SlideShow([]));
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({"code": "CODE ON SERVER"});
    spyOn(CodeSlide.prototype, 'run').andCallThrough();
    spyOn(Resource.prototype, 'post').andReturn('EXECUTION RESULT');    
  });
  
  it("should get code, run it and display result on standard output", function() {    
    IDESlide.getAndRun();

    expect(ServerExecutionContext.prototype.getContextOnServer).toHaveBeenCalledWith(IDESlide._getAndRunResource + "/0");    
    expect(CodeSlide.prototype.run).toHaveBeenCalled();    

    expect(slideNode.querySelector('#code_input').value).toBe('CODE ON SERVER');
    expect(slideNode.querySelector('#code_output').value).toBe('EXECUTION RESULT');
  });  
  
});

describe("BLACKBOARD IDE RUN", function() {
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);
    IDESlide = new BlackboardCodeSlide(slideNode);  
    spyOn(BlackboardCodeSlide.prototype ,"run");
  });

  it("should NOT be triggered", function() {
    slideNode.querySelector('#execute').setAttribute("disabled", true);
	  
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), R, ALT);

    expect(BlackboardCodeSlide.prototype.run).not.toHaveBeenCalled();
  });
  
});
  
describe("ATTENDEE IDE RUN", function() {
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);   
    IDESlide = new AttendeeCodeSlide(slideNode, new SlideShow([])); 
    IDESlide._editor.updateWithText("CODE");
    spyOn(AttendeeCodeSlide.prototype ,"run");
  });  

  it("should be triggered when RUN BUTTON clicked", function() {
    slideNode.querySelector('#execute').click();

    expect(AttendeeCodeSlide.prototype.run.calls.length).toBe(1);    
  });
  
  it("should be triggered when ALT-R pressed", function() {
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), R, ALT);
	  
    expect(AttendeeCodeSlide.prototype.run.calls.length).toBe(1);
  });
});
  
describe("ATTENDEE IDE RUN & SEND BUTTON", function() {   
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);  
    IDESlide = new AttendeeCodeSlide(slideNode, new SlideShow([]));  
    spyOn(AttendeeCodeSlide.prototype ,"runAndSend"); 
  });

  it("should be triggered when SEND BUTTON clicked", function() {  
    slideNode.querySelector('#send_code').click();

    expect(AttendeeCodeSlide.prototype.runAndSend.calls.length).toBe(1);        
  });  
  
  it("should be triggered when ALT-S pressed", function() {
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), S, ALT);
	  
    expect(AttendeeCodeSlide.prototype.runAndSend.calls.length).toBe(1);
  });
  
});

describe("ATTENDEE IDE GET & RUN BUTTON", function() {  
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE); 
    IDESlide = new AttendeeCodeSlide(slideNode, new SlideShow([]));  
    spyOn(AttendeeCodeSlide.prototype ,"getAndRun");    
  });  
  
  it("should be triggered when GET & RUN BUTTON clicked", function() {  
    slideNode.querySelector('#get_code').click();

    expect(AttendeeCodeSlide.prototype.getAndRun.calls.length).toBe(1);
  });  
  
  it("should be triggered when ALT-G pressed", function() {
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), G, ALT);

    expect(AttendeeCodeSlide.prototype.getAndRun.calls.length).toBe(1);   
  });

});

describe("TEACHER IDE RUN", function() {
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);        
    IDESlide = new TeacherCodeSlide(slideNode, new SlideShow([]));  
    spyOn(TeacherCodeSlide.prototype ,"run");
    IDESlide._editor.updateWithText("CODE");
  });  

  it("should be triggered when RUN BUTTON clicked", function() {
    slideNode.querySelector('#execute').click();
   
    expect(TeacherCodeSlide.prototype.run.calls.length).toBe(1);     
  });
  
  it("should be triggered when ALT-R pressed", function() {
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), R, ALT);
	  
    expect(TeacherCodeSlide.prototype.run.calls.length).toBe(1); 
  });
  
});

describe("TEACHER IDE RUN & SEND BUTTON", function() {   
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);
    IDESlide = new TeacherCodeSlide(slideNode);  
    spyOn(TeacherCodeSlide.prototype ,"runAndSend");
  }); 

  it("should NOT be triggered", function() {
    slideNode.querySelector('#send_code').setAttribute("disabled", true);
	  
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), S, ALT);

    expect(TeacherCodeSlide.prototype.runAndSend).not.toHaveBeenCalled();
  });
  
});

describe("TEACHER IDE GET & RUN BUTTON", function() {  
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);
    IDESlide = new CodeSlide(slideNode);
    spyOn(TeacherCodeSlide.prototype ,"getAndRun");   
  });
  
  it("should NOT be triggered", function() {
    slideNode.querySelector('#get_code').setAttribute("disabled", true);    
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), G, ALT);
   
    expect(TeacherCodeSlide.prototype.getAndRun).not.toHaveBeenCalledWith();  
  });

});

describe("TEACHER IDE GET LAST SEND", function() {   
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);
    IDESlide = new TeacherCodeSlide(slideNode, new SlideShow([]));
    spyOn(TeacherCodeSlide.prototype ,"runAndSend").andCallThrough(); 
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({"author": '', "code": 'ATTENDEE SEND', "code_to_add": ''});      
    spyOn(Resource.prototype, 'post').andReturn('ATTENDEE SEND RESULT');  
  });
  
  it("should get last send, run it and display it to standard output", function() {  
    IDESlide._updateEditorWithLastSendAndExecute();

    expect(TeacherCodeSlide.prototype.runAndSend).toHaveBeenCalledWith();

    expect(slideNode.querySelector('#code_input').value).toBe('ATTENDEE SEND');
    expect(slideNode.querySelector('#code_output').value).toBe('ATTENDEE SEND RESULT');
  }); 

});

describe("TEACHER IDE GET LAST SEND", function() {  

  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);
    IDESlide = new TeacherCodeSlide(slideNode, new SlideShow([]));
    spyOn(TeacherCodeSlide.prototype ,"_updateEditorWithLastSendAndExecute");  
  });

  it("should be triggered when GET LAST SEND BUTTON clicked", function() {  
    slideNode.querySelector('#get_last_send').click();

    expect(TeacherCodeSlide.prototype._updateEditorWithLastSendAndExecute.calls.length).toBe(1);
  });   
  
  it("should be triggered when ALT-N pressed", function() {
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), N, ALT);

    expect(TeacherCodeSlide.prototype._updateEditorWithLastSendAndExecute.calls.length).toBe(1);       
  });

});

