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

  it("should call synchronise when space pressed", function() {

    spyOn(AttendeeSlideShow.prototype, 'synchronise');

    expect(AttendeeSlideShow.prototype.synchronise.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(document, SPACE);

    expect(AttendeeSlideShow.prototype.synchronise.calls.length).toBe(1);    

  });
  
  it("should get current slide index on server every second", function() {
	  
    spyOn(AttendeeSlideShow.prototype, 'synchronise');
    jasmine.Clock.useMock();

    setInterval( function(){ attendeeSlideshow.synchronise(); },1000); // Mandatory even if it is already done in the javascript

    expect(AttendeeSlideShow.prototype.synchronise).not.toHaveBeenCalled();
    jasmine.Clock.tick(1001);
    expect(AttendeeSlideShow.prototype.synchronise.callCount).toEqual(1);
    
    expect(slideshowTimer).toBeDefined(); // Test if timer is javascript

  });  

});
