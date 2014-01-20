describe("TeacherSlideShow : keyboard handling", function() {

  it("should detect key pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'handleKeys');
	  
    expect(TeacherSlideShow.prototype.handleKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(document, RIGHT_ARROW);

    expect(TeacherSlideShow.prototype.handleKeys).toHaveBeenCalled();
    expect(TeacherSlideShow.prototype.handleKeys.calls.length).toBe(1); // ETRANGE DEVRAIT ETRE 1 mais 2 appels sont faits avec des objets de structure différentes

  });	

  it("should detect atlt-key pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'handleKeys');
	  
    expect(TeacherSlideShow.prototype.handleKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(document, R, ALT);

    expect(TeacherSlideShow.prototype.handleKeys).toHaveBeenCalled();
    expect(TeacherSlideShow.prototype.handleKeys.calls.length).toBe(1); // ETRANGE DEVRAIT ETRE 1 mais 2 appels sont faits avec des objets de structure différentes

  });	  
  
  it("should call next when right arrow pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'next');

    expect(TeacherSlideShow.prototype.next.calls.length).toBe(0);

    __triggerKeyboardEvent(document, RIGHT_ARROW);

    expect(TeacherSlideShow.prototype.next).toHaveBeenCalled();
    expect(TeacherSlideShow.prototype.next.calls.length).toBe(1); // ETRANGE DEVRAIT ETRE 1 mais 3 appels sont faits avec des objets de structure différentes
    expect(TeacherSlideShow.prototype.next).toHaveBeenCalledWith();    

  });  
  
  it("should call prev when left arrow pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'prev');

    expect(TeacherSlideShow.prototype.prev.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(document, LEFT_ARROW);

    expect(TeacherSlideShow.prototype.prev).toHaveBeenCalled();
    expect(TeacherSlideShow.prototype.prev.calls.length).toBe(1); // ETRANGE DEVRAIT ETRE 1 mais 4 appels sont faits avec des objets de structure différentes
    expect(TeacherSlideShow.prototype.prev).toHaveBeenCalledWith();    

  }); 

  it("should call synchronise when space pressed", function() {

    spyOn(TeacherSlideShow.prototype, 'synchronise');

    expect(TeacherSlideShow.prototype.synchronise.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(document, SPACE);

    expect(TeacherSlideShow.prototype.synchronise).toHaveBeenCalled();
    expect(TeacherSlideShow.prototype.synchronise.calls.length).toBe(1); // ETRANGE DEVRAIT ETRE 1 mais 5 appels sont faits avec des objets de structure différentes
    expect(TeacherSlideShow.prototype.synchronise).toHaveBeenCalledWith();    

  });
  
});
