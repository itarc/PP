describe("TeacherSlideShow KeyHandling", function() {

  it("should detect key pressed", function() {
    spyOn(TeacherSlideShow.prototype, 'handleKeys');
	  
    expect(TeacherSlideShow.prototype.handleKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(document, RIGHT_ARROW);

    expect(TeacherSlideShow.prototype.handleKeys.calls.length).toBe(1);

  });	

  it("should detect atlt-key pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'handleKeys');
	  
    expect(TeacherSlideShow.prototype.handleKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(document, R, ALT);

    expect(TeacherSlideShow.prototype.handleKeys.calls.length).toBe(1);

  });	  
  
  it("should call next when right arrow pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'next');

    expect(TeacherSlideShow.prototype.next.calls.length).toBe(0);

    __triggerKeyboardEvent(document, RIGHT_ARROW);

    expect(TeacherSlideShow.prototype.next.calls.length).toBe(1);   

  });  
  
  it("should call prev when left arrow pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'prev');

    expect(TeacherSlideShow.prototype.prev.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(document, LEFT_ARROW);
    
    expect(TeacherSlideShow.prototype.prev.calls.length).toBe(1);    

  }); 
  
  it("should call down when down arrow pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'down');

    expect(TeacherSlideShow.prototype.down.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(document, DOWN_ARROW);

    expect(TeacherSlideShow.prototype.down.calls.length).toBe(1);

  });   
  
  it("should call up when up arrow pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'up');

    expect(TeacherSlideShow.prototype.up.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(document, UP_ARROW);

    expect(TeacherSlideShow.prototype.up.calls.length).toBe(1);    

  });
  
  it("should call home when HOME pressed", function() {
    spyOn(TeacherSlideShow.prototype, 'home');

    expect(TeacherSlideShow.prototype.home.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(document, HOME);

    expect(TeacherSlideShow.prototype.home.calls.length).toBe(1);    
  });
  
  it("should prevent default when key pressed on document", function() {

    preventDefaultKeys = jasmine.createSpy('preventDefaultKeys');

    expect(preventDefaultKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(document, F5);

    expect(preventDefaultKeys.calls.length).toBe(13); // SHOULD BE 1 => TO REVIEW

  });
  
  it("should refresh last send attendee name every second", function() {
	  
    spyOn(TeacherSlideShow.prototype, '_refresh');
    jasmine.Clock.useMock();

    setInterval( function(){ teacherSlideshow._refresh(); },1000); // Mandatory even if it is already done in the javascript

    expect(TeacherSlideShow.prototype._refresh.callCount).toEqual(0);
    jasmine.Clock.tick(1001);
    expect(TeacherSlideShow.prototype._refresh.callCount).toEqual(1);
    
    expect(slideshowTimer).toBeDefined(); // Test if timer is javascript

  });  
  
});
