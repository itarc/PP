describe("SlideShow : teacher current slide management", function() {
	
  it("should post current slide index on server", function() {

    postResource = jasmine.createSpy('postResource');
	  
    var slideShow = new SlideShow([]);

    slideShow._postCurrentIndex();
	  
    expect(postResource).toHaveBeenCalled();
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + slideShow._currentIndex, ASYNCHRONOUS);

  });	

  it("should post current slide index on server when next slide is called", function() {

    spyOn(SlideShow.prototype, '_postCurrentIndex');
	  
    var slideShow = new SlideShow([]);	  
	  
    slideShow._currentIndex = 1;
    slideShow._numberOfSlides = 3;	  

    slideShow.next();
	  
    expect(SlideShow.prototype._postCurrentIndex).toHaveBeenCalled();
    expect(SlideShow.prototype._postCurrentIndex.calls.length).toBe(1);

  });

  
  it("should post current slide index on server when previous slide is called", function() {

    spyOn(SlideShow.prototype, '_postCurrentIndex');
	  
    var slideShow = new SlideShow([]);	  
	  
    slideShow._currentIndex = 2;
    slideShow._numberOfSlides = 3;	  

    slideShow.prev();
	  
    expect(SlideShow.prototype._postCurrentIndex).toHaveBeenCalled();
    expect(SlideShow.prototype._postCurrentIndex.calls.length).toBe(1);

  });

  it("should get current slide index on server when synchronise is called", function() {

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
    
  it("should always update current index with a number even if number is in string format ", function() {
    
    var slideShow = new SlideShow([]);
    expect(slideShow._currentIndex).toBe(0)	  

    getResource = jasmine.createSpy('getResource').andReturn('1'); 	  
    slideShow._getCurrentIndexOnServer();
	  
    expect(getResource).toHaveBeenCalled();
    expect(slideShow._currentIndex).toBe(1);    

  });   

  it("should get current index on server", function() {
    
    var slideShow = new SlideShow([]);
    slideShow._currentIndex = 1;	  

    getResource = jasmine.createSpy('getResource').andReturn(0);	  
    slideShow._getCurrentIndexOnServer();

    expect(slideShow._currentIndex).toBe(0);    

  });
  
});
