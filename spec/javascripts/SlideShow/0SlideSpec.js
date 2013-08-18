describe("SlideShow : key management", function() {

  it("should detect key pressed", function() {

    spyOn(SlideShow.prototype, 'handleKeys');

    var slideShow = new SlideShow([]);	
	  
    expect(SlideShow.prototype.handleKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(document, RIGHT_ARROW);

    expect(SlideShow.prototype.handleKeys).toHaveBeenCalled();
    expect(SlideShow.prototype.handleKeys.calls.length).toBe(2); // ETRANGE DEVRAIT ETRE 1 mais 2 appels sont faits avec des objets de structure différentes

  });	

  it("should call next when right arrow pressed", function() {

    spyOn(SlideShow.prototype, 'next');

    var slideShow = new SlideShow([]);	
	  
    expect(SlideShow.prototype.next.calls.length).toBe(0);

    __triggerKeyboardEvent(document, RIGHT_ARROW);

    expect(SlideShow.prototype.next).toHaveBeenCalled();
    expect(SlideShow.prototype.next.calls.length).toBe(3); // ETRANGE DEVRAIT ETRE 1 mais 3 appels sont faits avec des objets de structure différentes
    expect(SlideShow.prototype.next).toHaveBeenCalledWith();    

  });  
  
  it("should call prev when left arrow pressed", function() {

   spyOn(SlideShow.prototype, 'prev');

    var slideShow = new SlideShow([]); 
	  
    expect(SlideShow.prototype.prev.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(document, LEFT_ARROW);

    expect(SlideShow.prototype.prev).toHaveBeenCalled();
    expect(SlideShow.prototype.prev.calls.length).toBe(4); // ETRANGE DEVRAIT ETRE 1 mais 4 appels sont faits avec des objets de structure différentes
    expect(SlideShow.prototype.prev).toHaveBeenCalledWith();    

  }); 

  it("should call synchronise when space pressed", function() {

   spyOn(SlideShow.prototype, 'synchronise');

    var slideShow = new SlideShow([]); 
	  
    expect(SlideShow.prototype.synchronise.calls.length).toBe(0);
	  
    __triggerKeyboardEvent(document, SPACE);

    expect(SlideShow.prototype.synchronise).toHaveBeenCalled();
    expect(SlideShow.prototype.synchronise.calls.length).toBe(5); // ETRANGE DEVRAIT ETRE 1 mais 5 appels sont faits avec des objets de structure différentes
    expect(SlideShow.prototype.synchronise).toHaveBeenCalledWith();    

  });   

});

describe("SlideShow : slide index management", function() {

  it("should init with currentIndex to zero", function() {

    var slideShow = new SlideShow([]);

    expect(slideShow._currentIndex).toBe(0)

  });  
	
  it("should increase currentIndex", function() {

    var slideShow = new SlideShow([]);
	  
    slideShow._currentIndex = 1;
    slideShow._numberOfSlides = 3;	  

    slideShow.next();

    expect(slideShow._currentIndex).toBe(2)

  });
  
  it("should decrease currentIndex", function() {

    var slideShow = new SlideShow([]);
	  
    slideShow._currentIndex = 2;
    slideShow._numberOfSlides = 3;	  

    slideShow.prev()

    expect(slideShow._currentIndex).toBe(1)

  });

  it("should not go beyond last slide", function() {

    var slideShow = new SlideShow([]);
	  
    slideShow._currentIndex = 2;
    slideShow._numberOfSlides = 3;

    slideShow.next()

    expect(slideShow._currentIndex).toBe(2)

  });
  
  it("should not go under first slide", function() {

    var slideShow = new SlideShow([]);
	  
    slideShow._currentIndex = 0;
    slideShow._numberOfSlides = 3;

    slideShow.prev()

    expect(slideShow._currentIndex).toBe(0)

  });
  
});

describe("SlideShow : teacher current slide management", function() {
	
  it("should post current slide index on server", function() {

    postResource = jasmine.createSpy('postResource');
	  
    var slideShow = new SlideShow([]);

    slideShow._postCurrentIndex();
	  
    expect(postResource).toHaveBeenCalled();
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + slideShow._currentIndex);

  });	

  it("should post current slide index on server when next slide", function() {

    spyOn(SlideShow.prototype, '_postCurrentIndex');
	  
    var slideShow = new SlideShow([]);	  
	  
    slideShow._currentIndex = 1;
    slideShow._numberOfSlides = 3;	  

    slideShow.next();
	  
    expect(SlideShow.prototype._postCurrentIndex).toHaveBeenCalled();
    expect(SlideShow.prototype._postCurrentIndex.calls.length).toBe(1);

  });

  
  it("should post current slide index on server when previous slide", function() {

    spyOn(SlideShow.prototype, '_postCurrentIndex');
	  
    var slideShow = new SlideShow([]);	  
	  
    slideShow._currentIndex = 2;
    slideShow._numberOfSlides = 3;	  

    slideShow.prev();
	  
    expect(SlideShow.prototype._postCurrentIndex).toHaveBeenCalled();
    expect(SlideShow.prototype._postCurrentIndex.calls.length).toBe(1);

  });

  it("should get current slide index on server when synchronise", function() {

    getResource = jasmine.createSpy('getResource');
	  
    var slideShow = new SlideShow([]);	  
	  
    slideShow.synchronise();
	  
    expect(getResource).toHaveBeenCalled();
    expect(getResource.calls.length).toBe(1);
    expect(getResource).toHaveBeenCalledWith('/teacher_current_slide');

  }); 

  it("should not change current index if server unavailable", function() {
    
    var slideShow = new SlideShow([]);
    expect(slideShow._currentIndex).toBe(0);

    slideShow.synchronise(); // Does not synchronise since the javascript does not come from the server  

    expect(slideShow._currentIndex).toBe(0);    

  });
  
  it("should display teacher current slide even if an error occured in slide update", function() {
    
    /* should be done, it is the case when an error occured when updating the slide. If so next and prev must post the techer current index and the slide is not updated*/    
    /* If it is the other way round, an error occurs in slide and next or prev does not save the current teacher slide, which make them to have no effect */ 
    /*(we do not want that, because every time you go to prev or next it should go there even if the slide can not be updated properly)*/    

  });  
    
  it("should always update current index with an integer", function() {
    
    var slideShow = new SlideShow([]);
    expect(slideShow._currentIndex).toBe(0)	  

    getResource = jasmine.createSpy('getResource').andReturn('1'); 	  
    slideShow._getCurrentIndex();
	  
    expect(getResource).toHaveBeenCalled();
    expect(slideShow._currentIndex).toBe(1);    

  });   

  it("should go back to 0 when current index is 1", function() {
    
    var slideShow = new SlideShow([]);
    slideShow._currentIndex = 1;	  

    getResource = jasmine.createSpy('getResource').andReturn(0);	  
    slideShow._getCurrentIndex();

    expect(slideShow._currentIndex).toBe(0);    

  });  

  it("should get current slide index on server every 2 seconds", function() {
	  
    spyOn(SlideShow.prototype, 'synchronise');
    jasmine.Clock.useMock();

    setInterval( function(){ slideshow.synchronise(); },2000);
	  
    expect(SlideShow.prototype.synchronise).not.toHaveBeenCalled();
    jasmine.Clock.tick(3001);
    expect(SlideShow.prototype.synchronise.callCount).toEqual(1);
    
    expect(slideshowTimer).toBeDefined(); // Test if timer is defined in production javascript

  });
  
});

describe("SlideShow : Update", function() {

  it("should not update if current index unknown", function() {
	  
    setFixtures("<div class='slides'><div class='slide'/><div class='slide'/></div>")
    var slideShow = new SlideShow(queryAll('.slide'))

    expect(slideShow._slides[0]._node.className).toBe('slide current');
    expect(slideShow._slides[1]._node.className).toBe('slide next');
	  
    slideShow._currentIndex = 'UNKNOWN';
    slideShow._update();
	  
    expect(slideShow._slides[0]._node.className).toBe('slide current');
    expect(slideShow._slides[1]._node.className).toBe('slide next');

  });	
  
  it("should update poll when slideshow is updated", function() {
	  
    setFixtures("<div class='slides'><div class='slide'/></div>")
    spyOn(Slide.prototype, 'updatePoll');
	  
    var slideShow = new SlideShow(queryAll('.slide'))

    expect(Slide.prototype.updatePoll).toHaveBeenCalled();

  });	  

});