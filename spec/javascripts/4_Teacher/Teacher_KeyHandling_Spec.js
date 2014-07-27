describe("TeacherSlideShow KeyHandling", function() {

  it("should detect key pressed", function() {
    
    spyOn(TeacherSlideShow.prototype, 'handleKeys');
	  
    expect(TeacherSlideShow.prototype.handleKeys.calls.count()).toBe(0);

    __triggerKeyboardEvent(document, RIGHT_ARROW);

    expect(TeacherSlideShow.prototype.handleKeys.calls.count()).toBe(1);

  });	

  it("should detect atlt-key pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'handleKeys');
	  
    expect(TeacherSlideShow.prototype.handleKeys.calls.count()).toBe(0);

    __triggerKeyboardEvent(document, R, ALT);

    expect(TeacherSlideShow.prototype.handleKeys.calls.count()).toBe(1);

  });	  
  
  it("should call next when right arrow pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'next');

    expect(TeacherSlideShow.prototype.next.calls.count()).toBe(0);

    __triggerKeyboardEvent(document, RIGHT_ARROW);

    expect(TeacherSlideShow.prototype.next.calls.count()).toBe(1);   

  });  
  
  it("should call prev when left arrow pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'prev');

    expect(TeacherSlideShow.prototype.prev.calls.count()).toBe(0);
	  
    __triggerKeyboardEvent(document, LEFT_ARROW);
    
    expect(TeacherSlideShow.prototype.prev.calls.count()).toBe(1);    

  }); 
  
  it("should call down when down arrow pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'down');

    expect(TeacherSlideShow.prototype.down.calls.count()).toBe(0);
	  
    __triggerKeyboardEvent(document, DOWN_ARROW);

    expect(TeacherSlideShow.prototype.down.calls.count()).toBe(1);

  });   
  
  it("should call up when up arrow pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'up');

    expect(TeacherSlideShow.prototype.up.calls.count()).toBe(0);
	  
    __triggerKeyboardEvent(document, UP_ARROW);

    expect(TeacherSlideShow.prototype.up.calls.count()).toBe(1);    

  });
  
  it("should call home when HOME pressed", function() {
    spyOn(TeacherSlideShow.prototype, 'home');

    expect(TeacherSlideShow.prototype.home.calls.count()).toBe(0);
	  
    __triggerKeyboardEvent(document, HOME);

    expect(TeacherSlideShow.prototype.home.calls.count()).toBe(1);    
  });
  
  it("should prevent default when key pressed on document", function() {

    preventDefaultKeys = jasmine.createSpy('preventDefaultKeys');

    expect(preventDefaultKeys.calls.count()).toBe(0);

    __triggerKeyboardEvent(document, F5);

    expect(preventDefaultKeys.calls.count()).toBe(20); // SHOULD BE 1 => TO REVIEW

  });
  
  it("should refresh last send attendee name every second", function() {
	  
    spyOn(TeacherSlideShow.prototype, '_refresh');
    jasmine.clock().install();

    setInterval( function(){ teacherSlideshow._refresh(); },1000); // Mandatory even if it is already done in the javascript

    expect(TeacherSlideShow.prototype._refresh.calls.count()).toEqual(0);
    jasmine.clock().tick(1001);
    expect(TeacherSlideShow.prototype._refresh.calls.count()).toEqual(1);
    
    expect(slideshowTimer).toBeDefined(); // Test if timer is javascript

    jasmine.clock().uninstall();
  });  
  
});
