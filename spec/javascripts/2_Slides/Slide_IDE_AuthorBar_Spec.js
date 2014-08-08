IDE_slide_with_attendee_name_field_html =  
HEADER + 
code_input + 
"<div class='code_helper'>AUTHOR NAME?<input id='attendee_name' type='text'></div>"+
author_bar +
buttons + 
code_ouput + 
FOOTER

describe("ATTENDEE IDE Author Bar", function() {  
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_with_attendee_name_field_html);
    spyOn(Resource.prototype, "get").andReturn('a name');    
    slide = new CodeSlide(slideNode);    
   });	  
   
  it("should display login when initialized", function() {	  
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a name");  
  });

}); 
  
describe("ATTENDEE IDE Author Bar / Login", function() {  
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_with_attendee_name_field_html);   
    slide = new CodeSlide(slideNode);    
   });
   
  it("should display new login and save it", function() {
    spyOn(Resource.prototype, "post");  
    spyOn(Resource.prototype, "get").andReturn('a new name');     
    
    slideNode.querySelector('#attendee_name').value = 'a new name';
    __triggerKeyboardEvent(slideNode.querySelector('#attendee_name'), RETURN);
     
    expect(Resource.prototype.post).toHaveBeenCalledWith("session_id/attendee_name", "attendee_name=a new name", SYNCHRONOUS);     
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a new name");    
  });
  
  it("should keep displaying login when attendee executes code", function() {
    spyOn(Resource.prototype, "get").andReturn('a new name'); 
    
    slideNode.querySelector('#attendee_name').value = 'a new name';
    __triggerKeyboardEvent(slideNode.querySelector('#attendee_name'), RETURN);
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a new name");  

    slide._editor.updateWithText("code to execute");
    slideNode.querySelector('#execute').click();
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a new name");    
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
"<input type='button' id='get_last_send'/>"+
code_ouput + 
FOOTER


describe("TEACHER IDE Author Bar", function() {  
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_with_last_send_attendee_name_html);
    spyOn(Resource.prototype, "get").andReturn('a name');
    slideshow = new SlideShow([]) 
    slide = new TeacherCodeSlide(slideNode, slideshow);    
   });	

  it("should display the author name of the last send in editor", function() {
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({author: 'attendee name', code: 'code sent'});     
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a name");
    
    slideNode.querySelector('#get_last_send').click();
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("attendee name");    
  });   
   
  it("should show last send attendee name when upated", function() {
    spyOn(TeacherCodeSlide.prototype, '_updateLastSendAttendeeName');	  
	  
    slide._update(0);
	  
    expect(TeacherCodeSlide.prototype._updateLastSendAttendeeName.calls.length).toBe(1);
  });     
   
   
  it("should display the author name of the last send on server", function() {   
    slide._update(0);
    
    expect(slideNode.querySelector('#last_send_attendee_name').innerHTML.replace(/&gt;/g, '>')).toBe("a name >> "); 
  }); 

  it("should display the author name of the last send in editor even if the code on server is the same in editor", function() {   
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({author: 'attendee name', code: 'code sent'});       
    slide._editor.updateWithText("code sent");
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a name");
    
    slideNode.querySelector('#get_last_send').click();
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("attendee name");
  });  
  
  it("should replace author name with teacher session ID when teacher executes code", function() {
    slide._editor.updateWithText("code to execute");
    slideNode.querySelector('#author_name').innerHTML = 'a name to replace';
    
    slideNode.querySelector('#execute').click();
    
    expect(slideNode.querySelector('#author_name').innerHTML).toBe("a name");    
  });  
   
});
