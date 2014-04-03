describe("TeacherSlideShow Current Slide", function() {

  it("should be sent to server when when next slide is called", function() {

    getResource = jasmine.createSpy('getResource').andReturn('0;false');
    postResource = jasmine.createSpy('postResource').andReturn('0;false');
	  
    var slideShow = new SlideShow([]);	  
	  
    slideShow._currentIndex = 1;
    slideShow._numberOfSlides = 3;	  

    slideShow.next();
	  
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=2' + '&' + 'ide_displayed=' + SlideShow.prototype._showIDE, true);

  });

  it("should be sent to server when previous slide is called", function() {

    getResource = jasmine.createSpy('getResource');
    postResource = jasmine.createSpy('postResource');
	  
    var slideShow = new SlideShow([]);	  
	  
    slideShow._currentIndex = 2;
    slideShow._numberOfSlides = 3;	  

    slideShow.prev();
	  
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=1' + '&' + 'ide_displayed=' + SlideShow.prototype._showIDE, true);

  });

  it("should be retreived from server when synchronise is called", function() {

    getResource = jasmine.createSpy('getResource');
	  
    var slideShow = new SlideShow([]);	

    expect(getResource.calls.length).toBe(1);	  
	  
    slideShow.synchronise();
	  
    expect(getResource).toHaveBeenCalled();
    expect(getResource.calls.length).toBe(2);
    expect(getResource).toHaveBeenCalledWith('/teacher_current_slide');

  }); 

  it("should not change if server unavailable", function() {
    
    var slideShow = new SlideShow([]);
    
    expect(slideShow._currentIndex).toBe(0);

    slideShow.synchronise(); // Does not synchronise since the javascript does not come from the server  

    expect(slideShow._currentIndex).toBe(0);    

  });
  
});
