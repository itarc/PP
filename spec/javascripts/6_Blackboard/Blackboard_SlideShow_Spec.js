BLAKBOARD_SLIDESHOW_WITH_1_IDE_SLIDE_ONLY =  
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

describe("Blackboard SlideShow IDE", function() {
  
  beforeEach(function () {
    setFixtures(BLAKBOARD_SLIDESHOW_WITH_1_IDE_SLIDE_ONLY)	
    spyOn(Resource.prototype, "get").andReturn('{}');
    blackboardSlideShow = new BlackboardSlideShow(queryAll(document, '.slide')); 
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({ "author": '0', "type": 'run', "code": 'last send to blackboard',"code_to_add": '' });    
    spyOn(StandardOutput.prototype, 'updateWith');  
    expect(StandardOutput.prototype.updateWith.calls.length).toBe(0);    
  });
  
  it("should get last Teacher run when refreshed", function() {
    blackboardSlideShow._refresh();

    expect(ServerExecutionContext.prototype.getContextOnServer).toHaveBeenCalledWith('/code_get_last_send_to_blackboard/0');    
    expect(blackboardSlideShow._slides[0]._editor.content()).toBe('last send to blackboard');
    expect(StandardOutput.prototype.updateWith.calls.length).toBe(1);    
  });  
  
  it("should NOT change if execution context has not changed", function() {
    blackboardSlideShow._slides[0]._editor.updateWithText("last send to blackboard");
    blackboardSlideShow._slides[0]._authorBar.updateAuthorNameWith('0');
    
    blackboardSlideShow._refresh();
    
    expect(StandardOutput.prototype.updateWith.calls.length).toBe(0);
  });
  
  it("should be updated every refresh", function() {
    spyOn(BlackboardCodeSlide.prototype, '_update');
    spyOn(Position.prototype, '_getPosition').andReturn('3;true');
    
    blackboardSlideShow._refresh();
    
    expect(BlackboardCodeSlide.prototype._update.calls.length).toBe(2); // init + update in blackboard
    
    blackboardSlideShow._refresh();
    
    expect(BlackboardCodeSlide.prototype._update.calls.length).toBe(3);
  });    
  
  it("should refresh position every second", function() {
    
    
    spyOn(BlackboardSlideShow.prototype, '_refresh');
    jasmine.Clock.useMock();

    setInterval( function(){ blackboardSlideShow._refresh(); },1000); // Mandatory even if it is already done in the javascript

    expect(BlackboardSlideShow.prototype._refresh.callCount).toEqual(0);
    jasmine.Clock.tick(1001);
    expect(BlackboardSlideShow.prototype._refresh.callCount).toEqual(1);
    
    expect(slideshowTimer).toBeDefined(); // Test if timer in javascript
  });  

});
