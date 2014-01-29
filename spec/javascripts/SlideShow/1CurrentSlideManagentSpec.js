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
  
});
