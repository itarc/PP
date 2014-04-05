describe("TeacherSlideShow KeyHandling", function() {

  it("should detect key pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'handleKeys');
	  
    expect(TeacherSlideShow.prototype.handleKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(document, RIGHT_ARROW);

    expect(TeacherSlideShow.prototype.handleKeys).toHaveBeenCalled();
    expect(TeacherSlideShow.prototype.handleKeys.calls.length).toBe(1);

  });	

  it("should detect atlt-key pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'handleKeys');
	  
    expect(TeacherSlideShow.prototype.handleKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(document, R, ALT);

    expect(TeacherSlideShow.prototype.handleKeys).toHaveBeenCalled();
    expect(TeacherSlideShow.prototype.handleKeys.calls.length).toBe(1);

  });	  
  
  it("should call next when right arrow pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'next');

    expect(TeacherSlideShow.prototype.next.calls.length).toBe(0);

    __triggerKeyboardEvent(document, RIGHT_ARROW);

    expect(TeacherSlideShow.prototype.next).toHaveBeenCalled();
    expect(TeacherSlideShow.prototype.next.calls.length).toBe(1);
    expect(TeacherSlideShow.prototype.next).toHaveBeenCalledWith();    

  });  
  
  it("should call prev when left arrow pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'prev');

    expect(TeacherSlideShow.prototype.prev.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(document, LEFT_ARROW);

    expect(TeacherSlideShow.prototype.prev).toHaveBeenCalled();
    expect(TeacherSlideShow.prototype.prev.calls.length).toBe(1);
    expect(TeacherSlideShow.prototype.prev).toHaveBeenCalledWith();    

  }); 
  
  it("should call down when down arrow pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'down');

    expect(TeacherSlideShow.prototype.down.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(document, DOWN_ARROW);

    expect(TeacherSlideShow.prototype.down).toHaveBeenCalled();
    expect(TeacherSlideShow.prototype.down.calls.length).toBe(1);
    expect(TeacherSlideShow.prototype.down).toHaveBeenCalledWith();    

  });   
  
  it("should call up when up arrow pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'up');

    expect(TeacherSlideShow.prototype.up.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(document, UP_ARROW);

    expect(TeacherSlideShow.prototype.up).toHaveBeenCalled();
    expect(TeacherSlideShow.prototype.up.calls.length).toBe(1);
    expect(TeacherSlideShow.prototype.up).toHaveBeenCalledWith();    

  });  

  it("should refresh position and show current slide (F5) when space pressed", function() {

    spyOn(TeacherSlideShow.prototype, '_refreshPosition');
    spyOn(TeacherSlideShow.prototype, '_showCurrentSlide');

    expect(TeacherSlideShow.prototype._refreshPosition.calls.length).toBe(0);
    expect(TeacherSlideShow.prototype._showCurrentSlide.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(document, SPACE);

    expect(TeacherSlideShow.prototype._refreshPosition.calls.length).toBe(1);
    expect(TeacherSlideShow.prototype._showCurrentSlide.calls.length).toBe(1);

  });
  
});
