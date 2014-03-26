describe("TeacherSlideShow Current Slide", function() {

  it("should be sent to server when when next slide is called", function() {

    postResource = jasmine.createSpy('getResource');
	  
    var slideShow = new SlideShow([]);	  
	  
    slideShow._currentIndex = 1;
    slideShow._numberOfSlides = 3;	  

    slideShow.next();
	  
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=2', true);

  });

  
  it("should be sent to server when previous slide is called", function() {

    postResource = jasmine.createSpy('getResource');
	  
    var slideShow = new SlideShow([]);	  
	  
    slideShow._currentIndex = 2;
    slideShow._numberOfSlides = 3;	  

    slideShow.prev();
	  
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=1', true);

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
    
  //~ it("should be server current index enven if server returns a string format ", function() {
    
    //~ var slideShow = new SlideShow([]);
    //~ expect(slideShow._currentIndex).toBe(0)	  

    //~ getResource = jasmine.createSpy('getResource').andReturn('1'); 	  
    //~ slideShow._getCurrentIndexOnServer();
	  
    //~ expect(getResource).toHaveBeenCalled();
    //~ expect(slideShow._currentIndex).toBe(1);    

  //~ });   

  //~ it("should get current index on server", function() {
    
    //~ var slideShow = new SlideShow([]);
    //~ slideShow._currentIndex = 1;	  

    //~ getResource = jasmine.createSpy('getResource').andReturn(0);	  
    //~ slideShow._getCurrentIndexOnServer();

    //~ expect(slideShow._currentIndex).toBe(0);    

  //~ });  
  
});
