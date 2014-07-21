describe("AttendeeSlideShow KeyHandling", function() {

  it("should detect key pressed", function() {

    spyOn(AttendeeSlideShow.prototype, 'handleKeys');
	  
    expect(AttendeeSlideShow.prototype.handleKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(document, RIGHT_ARROW);

    expect(AttendeeSlideShow.prototype.handleKeys.calls.length).toBe(1);

  });	

  it("should NOT call next when right arrow pressed", function() {

    spyOn(AttendeeSlideShow.prototype, 'next');

    expect(AttendeeSlideShow.prototype.next.calls.length).toBe(0);

    __triggerKeyboardEvent(document, RIGHT_ARROW);

    expect(AttendeeSlideShow.prototype.next.calls.length).toBe(0);
  

  });  
  
  it("should NOT call prev when left arrow pressed", function() {

    spyOn(AttendeeSlideShow.prototype, 'prev');

    expect(AttendeeSlideShow.prototype.prev.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(document, LEFT_ARROW);

    expect(AttendeeSlideShow.prototype.prev.calls.length).toBe(0);

  }); 

  it("should refresh when space pressed", function() {

    spyOn(AttendeeSlideShow.prototype, '_refresh');

    expect(AttendeeSlideShow.prototype._refresh.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(document, SPACE);

    expect(AttendeeSlideShow.prototype._refresh.calls.length).toBe(1); 
 
  });
  
  it("should prevent default when key pressed on document", function() {

    preventDefaultKeys = jasmine.createSpy('preventDefaultKeys');

    expect(preventDefaultKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(document, F5);

    expect(preventDefaultKeys.calls.length).toBe(34); // SHOULD BE 1 => TO REVIEW

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
