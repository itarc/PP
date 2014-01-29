describe("SlideShow slide index management :", function() {

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

describe("TeacherSlideShow : teacher current slide management", function() {
	
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

describe("SlideShow : Update", function() {
	
  it("should update first slide to current when slideshow initialized", function() {
	  
    setFixtures("<div class='slides'><div class='slide'/><div class='slide'/></div>")
    var slideShow = new SlideShow(queryAll('.slide'))

    expect(slideShow._slides[0]._node.className).toBe('slide current');

  });		

  it("should not update if current index unknown", function() {
	  
    setFixtures("<div class='slides'><div class='slide'/><div class='slide'/></div>")
    var slideShow = new SlideShow(queryAll('.slide'))

    expect(slideShow._slides[0]._node.className).toBe('slide current');
	  
    slideShow._currentIndex = 'UNKNOWN';
    slideShow._update_current_slide_state();
	  
    expect(slideShow._slides[0]._node.className).toBe('slide current');

  });	
  
  it("should update poll when slideshow is updated", function() {
	  
    setFixtures("<div class='slides'><div class='slide'/></div>")
    spyOn(Slide.prototype, 'updatePoll');
	  
    var slideShow = new SlideShow(queryAll('.slide'))

    expect(Slide.prototype.updatePoll).toHaveBeenCalled();

  });	  

  it("should update coding slide if slideshow is updated", function() {

    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='code_output'><div class='slide'/></div>")	  
    spyOn(Slide.prototype, 'updateCodingSlide');

    var slideShow = new SlideShow(queryAll('.slide'))

    expect(Slide.prototype.updateCodingSlide).toHaveBeenCalled();    
    expect(Slide.prototype.updateCodingSlide).toHaveBeenCalledWith(slideShow._currentIndex);   	  

  });  
  
  it("should update coding slide when synchronised", function() {

    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='code_output'><div class='slide'/></div>")	  
    spyOn(Slide.prototype, 'updateCodingSlide');

    var slideShow = new SlideShow(queryAll('.slide'))	  
    slideShow.synchronise();

    expect(Slide.prototype.updateCodingSlide).toHaveBeenCalled();    
    expect(Slide.prototype.updateCodingSlide).toHaveBeenCalledWith(slideShow._currentIndex);    

  });  

  it("should update coding slide when synchronised and slide is down (i.e. coding slide is visible)", function() {

    setFixtures("<div class='slides'><div class='slide'></div><div class='slide'></div><div class='slide'><div id='code_input'><div id='execute'><div id='code_output'><div class='slide'/></div>")	  
    spyOn(Slide.prototype, 'updateCodingSlide');

    var slideShow = new SlideShow(queryAll('.slide'))	  
    slideShow.down();
    slideShow.synchronise();

    expect(Slide.prototype.updateCodingSlide).toHaveBeenCalled();    
    expect(Slide.prototype.updateCodingSlide).toHaveBeenCalledWith(slideShow._currentIndex);    

  });  

  it("should not update slideshow state if slide down (i.e. coding slide is visible)", function() {
	  
   setFixtures("<div class='slides'><div class='slide'></div><div class='slide'></div><div class='slide'><div id='code_input'><div class='code_helper'></div><div class='code_helper'></div><div id='execute'><div id='code_output'></div></div>")	  
   spyOn(SlideShow.prototype, '_update_current_slide_state');
	  
    var slideShow = new SlideShow(queryAll('.slide'))

    expect(SlideShow.prototype._update_current_slide_state.calls.length).toBe(1);

    slideShow.down();

    slideShow.next(); 
    expect(SlideShow.prototype._update_current_slide_state.calls.length).toBe(1);

    slideShow.prev();  
    expect(SlideShow.prototype._update_current_slide_state.calls.length).toBe(1);
	  
    slideShow.synchronise();  
    expect(SlideShow.prototype._update_current_slide_state.calls.length).toBe(1);    

    slideShow.up();
    expect(SlideShow.prototype._update_current_slide_state.calls.length).toBe(2);	  
	  
    slideShow.next(); 
    expect(SlideShow.prototype._update_current_slide_state.calls.length).toBe(3);

    slideShow.prev();  
    expect(SlideShow.prototype._update_current_slide_state.calls.length).toBe(4);

    slideShow.synchronise();  
    expect(SlideShow.prototype._update_current_slide_state.calls.length).toBe(5);

  });   

});
