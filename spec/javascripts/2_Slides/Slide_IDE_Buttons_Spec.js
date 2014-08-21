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
  
  it("should format server response", function() {	 
    jsonContext = executionContext.getContextOnServer('/url')  
    
    expect(jsonContext.author).toBe('server_author');
    expect(jsonContext.code).toBe('server_code');
    expect(jsonContext.code_to_add).toBe('server_code to add');
  });    
  
  it("should update context with a resource", function() {
    executionContext.updateWithResource('/url');
	  
    expect(executionContext.author).toBe('server_author');
    expect(executionContext.type).toBe('run_type');
    expect(executionContext.code).toBe('server_code');
    expect(executionContext.code_to_add).toBe('server_code to add');
  });  
  
}); 

describe("IDE EXECUTE AT", function() {
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);
    slideshow = new SlideShow([])   
    IDESlide = new CodeSlide(slideNode, slideshow);
    IDESlide._runResource = '/url'
    spyOn(Resource.prototype, 'post').andReturn('EXECUTION RESULT');
  });

  it("should NOT be called when IDE is initialized", function() {  
    expect(Resource.prototype.post.calls.length).toBe(0);   
  });  
  
  it("should NOT execute code when editor is empty", function() {
    IDESlide._editor.updateWithText("");
    
    IDESlide._displayRunResult();

    expect(Resource.prototype.post).not.toHaveBeenCalled();    
  });
  
  it("should execute code on server and show result on standard output", function() {
    IDESlide._editor.updateWithText("CODE");    

    IDESlide._displayRunResult();
	  
    expect(Resource.prototype.post.calls.length).toBe(1);
    expect(Resource.prototype.post).toHaveBeenCalledWith('/url/0', 'CODE', SYNCHRONOUS);
    expect(slideNode.querySelector('#code_input').value).toBe('CODE');
    expect(slideNode.querySelector('#code_output').value).toBe('EXECUTION RESULT');
  });  
  
  it("should execute code for current slide only", function() {
    IDESlide._editor.updateWithText("CODE");
    
    slideshow._currentIndex = 0;
    IDESlide._codeHelpers.update();
    IDESlide._displayRunResult();

    expect(Resource.prototype.post).toHaveBeenCalledWith('/url/0', 'CODE', SYNCHRONOUS);

    slideshow._currentIndex = 1;    
    IDESlide._codeHelpers.update();   
    IDESlide._displayRunResult();

    expect(Resource.prototype.post).toHaveBeenCalledWith('/url/1', 'CODE', SYNCHRONOUS);    
  });  
  
});

describe("BLACKBOARD IDE RUN", function() {
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);
    IDESlide = new BlackboardCodeSlide(slideNode);  
    spyOn(BlackboardCodeSlide.prototype ,"_displayRunResult");
  });

  it("should NOT be triggered when ALT-R disabled", function() {
    slideNode.querySelector('#execute').setAttribute("disabled", true);
	  
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), R, ALT);

    expect(BlackboardCodeSlide.prototype._displayRunResult).not.toHaveBeenCalled();
  });
  
});
  
describe("ATTENDEE IDE RUN", function() {
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);
    slideShow = new SlideShow([]);    
    IDESlide = new AttendeeCodeSlide(slideNode, slideShow);  
    spyOn(AttendeeCodeSlide.prototype ,"_displayRunResult");
    expect(AttendeeCodeSlide.prototype._displayRunResult.calls.length).toBe(0);    
  });  

  it("should be triggered when RUN BUTTON clicked", function() {
    slideNode.querySelector('#execute').click();

    expect(AttendeeCodeSlide.prototype._displayRunResult.calls.length).toBe(1);    
  });
  
  it("should be triggered when ALT-R pressed", function() {
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), R, ALT);
	  
    expect(AttendeeCodeSlide.prototype._displayRunResult.calls.length).toBe(1);  });
});
  
describe("ATTENDEE IDE RUN & SEND BUTTON", function() {   
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);
    slideShow = new SlideShow([]);    
    IDESlide = new AttendeeCodeSlide(slideNode, slideShow);  
    spyOn(AttendeeCodeSlide.prototype ,"_displayRunResult");
    spyOn(AttendeeCodeSlide.prototype ,"_saveRunResult");
    expect(AttendeeCodeSlide.prototype._displayRunResult.calls.length).toBe(0);    
  });

  it("should be triggered when SEND BUTTON clicked", function() {  
    slideNode.querySelector('#send_code').click();

    expect(AttendeeCodeSlide.prototype._displayRunResult.calls.length).toBe(1);
    expect(AttendeeCodeSlide.prototype._saveRunResult).toHaveBeenCalledWith('send');          
  });  
  
  it("should rbe triggered when ALT-S pressed", function() {
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), S, ALT);
	  
    expect(AttendeeCodeSlide.prototype._displayRunResult.calls.length).toBe(1);
    expect(AttendeeCodeSlide.prototype._saveRunResult).toHaveBeenCalledWith('send');
  });
  
});

describe("ATTENDEE IDE GET & RUN BUTTON", function() {  
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);
    slideShow = new SlideShow([]);    
    IDESlide = new AttendeeCodeSlide(slideNode, slideShow);  
    spyOn(AttendeeCodeSlide.prototype ,"_displayRunResult");   
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({"author": '', "code": 'CODE ON BLACKBOARD', "code_to_add": ''});     
    expect(AttendeeCodeSlide.prototype._displayRunResult.calls.length).toBe(0);    
  });  
  
  it("should be triggered when GET & RUN BUTTON clicked", function() {  
    slideNode.querySelector('#get_code').click();

    expect(ServerExecutionContext.prototype.getContextOnServer).toHaveBeenCalledWith('/code_get_last_send_to_blackboard/0');   
    expect(AttendeeCodeSlide.prototype._displayRunResult.calls.length).toBe(1);
  });  
  
  it("should be triggered when ALT-G pressed", function() {
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), G, ALT);

    expect(ServerExecutionContext.prototype.getContextOnServer).toHaveBeenCalledWith('/code_get_last_send_to_blackboard/0');   
    expect(AttendeeCodeSlide.prototype._displayRunResult.calls.length).toBe(1);   
  });

});

describe("ATTENDEE IDE GET LAST SEND", function() { 
  
    beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);    
    slide = new AttendeeCodeSlide(slideNode);
    spyOn(AttendeeCodeSlide.prototype ,"_displayRunResult");   
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({"author": '', "code": 'ATTENDEE SEND', "code_to_add": ''});     
  });
  
  it("should NOT be triggered when ALT-N BUTTON not present", function() {
    slideNode.querySelector('section').removeChild(slideNode.querySelector('section').querySelector('#get_last_send'));
    
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), N, ALT);

    expect(ServerExecutionContext.prototype.getContextOnServer).not.toHaveBeenCalled();   
    expect(AttendeeCodeSlide.prototype._displayRunResult).not.toHaveBeenCalled();
  });  
  
});

describe("TEACHER IDE RUN", function() {
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);
    slideShow = new SlideShow([]);        
    IDESlide = new TeacherCodeSlide(slideNode, slideShow);  
    spyOn(TeacherCodeSlide.prototype ,"_displayRunResult");
    expect(TeacherCodeSlide.prototype._displayRunResult.calls.length).toBe(0);    
  });  

  it("should be triggered when RUN BUTTON clicked", function() {
    slideNode.querySelector('#execute').click();
   
    expect(TeacherCodeSlide.prototype._displayRunResult.calls.length).toBe(1);     
  });
  
  it("should be triggered when ALT-R pressed", function() {
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), R, ALT);
	  
    expect(TeacherCodeSlide.prototype._displayRunResult.calls.length).toBe(1); 
  });
  
});

describe("TEACHER IDE RUN & SEND BUTTON", function() {   
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);
    IDESlide = new TeacherCodeSlide(slideNode);  
    spyOn(TeacherCodeSlide.prototype ,"_displayRunResult");
  }); 

  it("should NOT be triggered when ALT-S button disabled", function() {
    slideNode.querySelector('#send_code').setAttribute("disabled", true);
	  
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), S, ALT);

    expect(TeacherCodeSlide.prototype._displayRunResult).not.toHaveBeenCalled();
  });
  
});

describe("TEACHER IDE GET & RUN BUTTON", function() {  
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);
    IDESlide = new CodeSlide(slideNode);
    spyOn(CodeSlide.prototype ,"_displayRunResult");   
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({"author": '', "code": 'CODE ON BLACKBOARD', "code_to_add": ''});     
  });
  
  it("should NOT be triggered when ALT-G disabled", function() {
    slideNode.querySelector('#get_code').setAttribute("disabled", true);    
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), G, ALT);

    expect(ServerExecutionContext.prototype.getContextOnServer).not.toHaveBeenCalledWith();   
    expect(CodeSlide.prototype._displayRunResult).not.toHaveBeenCalledWith();  
  });

});

describe("TEACHER IDE GET LAST SEND", function() {   
  
  beforeEach(function () {
    slideNode = sandbox(FULL_IDE_SLIDE);    
    slideShow = new SlideShow([]);        
    slide = new TeacherCodeSlide(slideNode, slideShow);
    spyOn(TeacherCodeSlide.prototype ,"_displayRunResult");   
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({"author": '', "code": 'ATTENDEE SEND', "code_to_add": ''});     
    expect(TeacherCodeSlide.prototype._displayRunResult.calls.length).toBe(0);    
  });   
  
  it("should be triggered when GET LAST SEND BUTTON clicked", function() {  
    slideNode.querySelector('#get_last_send').click();

    expect(ServerExecutionContext.prototype.getContextOnServer).toHaveBeenCalledWith('/code_attendees_last_send/0');   
    expect(TeacherCodeSlide.prototype._displayRunResult.calls.length).toBe(1);   
  });   
  
  it("should be triggered when ALT-N pressed", function() {
    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), N, ALT);

    expect(ServerExecutionContext.prototype.getContextOnServer).toHaveBeenCalledWith('/code_attendees_last_send/0');   
    expect(TeacherCodeSlide.prototype._displayRunResult.calls.length).toBe(1);       
  });

});

