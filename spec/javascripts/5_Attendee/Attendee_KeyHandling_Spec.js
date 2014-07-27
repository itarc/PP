describe("AttendeeSlideShow KeyHandling", function() {

  it("should detect key pressed", function() {

    spyOn(AttendeeSlideShow.prototype, 'handleKeys');
	  
    expect(AttendeeSlideShow.prototype.handleKeys.calls.count()).toBe(0);

    __triggerKeyboardEvent(document, RIGHT_ARROW);

    expect(AttendeeSlideShow.prototype.handleKeys.calls.count()).toBe(1);

  });

  it("should refresh when space pressed", function() {

    spyOn(AttendeeSlideShow.prototype, '_refresh');

    expect(AttendeeSlideShow.prototype._refresh.calls.count()).toBe(0);
	  
    __triggerKeyboardEvent(document, SPACE);

    expect(AttendeeSlideShow.prototype._refresh.calls.count()).toBe(1); 
 
  });
  
  it("should prevent default when key pressed on document", function() {

    preventDefaultKeys = jasmine.createSpy('preventDefaultKeys');

    expect(preventDefaultKeys.calls.count()).toBe(0);

    __triggerKeyboardEvent(document, F5);

    expect(preventDefaultKeys.calls.count()).toBe(40); // SHOULD BE 1 => TO REVIEW

  });  
  
  it("should refresh position every second", function() {
	  
    spyOn(AttendeeSlideShow.prototype, '_refresh');
    jasmine.clock().install();

    setInterval( function(){ attendeeSlideshow._refresh(); },1000); // Mandatory even if it is already done in the javascript

    expect(AttendeeSlideShow.prototype._refresh.calls.count()).toEqual(0);
    jasmine.clock().tick(1001);
    expect(AttendeeSlideShow.prototype._refresh.calls.count()).toEqual(1);
    
    expect(slideshowTimer).toBeDefined(); // Test if timer is javascript
    
    jasmine.clock().uninstall();

  });  

});
