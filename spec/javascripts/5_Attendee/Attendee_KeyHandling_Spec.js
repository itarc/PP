describe("AttendeeSlideShow KeyHandling", function() {

  it("should detect key pressed", function() {

    spyOn(AttendeeSlideShow.prototype, 'handleKeys');
	  
    expect(AttendeeSlideShow.prototype.handleKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(document, RIGHT_ARROW);

    expect(AttendeeSlideShow.prototype.handleKeys.calls.length).toBe(1);

  });

  it("should refresh when space pressed", function() {

    spyOn(AttendeeSlideShow.prototype, '_refresh');

    expect(AttendeeSlideShow.prototype._refresh.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(document, SPACE);

    expect(AttendeeSlideShow.prototype._refresh.calls.length).toBe(1); 
 
  });
  
  it("should refresh position every second", function() {
	  
    spyOn(AttendeeSlideShow.prototype, '_refresh');
    jasmine.Clock.useMock();

    setInterval( function(){ attendeeSlideshow._refresh(); },1000); // Mandatory even if it is already done in the javascript

    expect(AttendeeSlideShow.prototype._refresh.callCount).toEqual(0);
    jasmine.Clock.tick(1001);
    expect(AttendeeSlideShow.prototype._refresh.callCount).toEqual(1);
    
    expect(slideshowTimer).toBeDefined(); // Test if timer is javascript

  });    

});

ATTENDEE_SLIDESHOW_FOR_KEY_HANDLING =  
"<div class='slides'>"+
HEADER + 
code_input + 
"<div class='code_helper'>AUTHOR NAME?<input id='attendee_name' type='text'></div>"+
author_bar +
buttons + 
code_ouput + 
FOOTER+
"</div>"

describe("AttendeeSlideShow KeyHandling", function() {
  
  beforeEach(function () {   
    setFixtures(ATTENDEE_SLIDESHOW_FOR_KEY_HANDLING)    
    slideShow = new AttendeeSlideShow(queryAll(document, '.slide'));    
  });  
  
  it("should prevent default when key pressed on document", function() {
    spyOn(AttendeeSlideShow.prototype, '_preventDefaultKeys');

    expect(AttendeeSlideShow.prototype._preventDefaultKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(document, F5);

    expect(AttendeeSlideShow.prototype._preventDefaultKeys.calls.length).toBe(2); // SHOULD BE 1 => TO REVIEW
  });
  
  it("should Not prevent default when key pressed in Attendee Login", function() {
    spyOn(AttendeeSlideShow.prototype, '_preventDefaultKeys');

    expect(AttendeeSlideShow.prototype._preventDefaultKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(document.querySelector('#attendee_name'), F5);

    expect(AttendeeSlideShow.prototype._preventDefaultKeys.calls.length).toBe(0); 
  });  
  
  it("should prevent default when key pressed in editor", function() {
    spyOn(AttendeeSlideShow.prototype, '_preventDefaultKeys');

    expect(AttendeeSlideShow.prototype._preventDefaultKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(slideShow._slides[0]._node.querySelector('#code_input'), F5);

    expect(AttendeeSlideShow.prototype._preventDefaultKeys.calls.length).toBe(1);
  });  
  
});
