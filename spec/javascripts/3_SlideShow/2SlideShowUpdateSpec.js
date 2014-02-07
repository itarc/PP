describe("SlideShow update", function() {
	
  it("should show first slide when slideshow initialized", function() {
	  
    setFixtures("<div class='slides'><div class='slide'/><div class='slide'/></div>")
    var slideShow = new SlideShow(queryAll('.slide'))

    expect(slideShow._slides[0]._node.className).toBe('slide current');

  });		

  it("should stay on current slide if new index is unknown", function() {
	  
    setFixtures("<div class='slides'><div class='slide'/><div class='slide'/></div>")
    var slideShow = new SlideShow(queryAll('.slide'))

    expect(slideShow._slides[0]._node.className).toBe('slide current');
	  
    slideShow._currentIndex = 'UNKNOWN';
    slideShow._show_current_slide();
	  
    expect(slideShow._slides[0]._node.className).toBe('slide current');

  });	
  
  it("should update poll when slideshow is updated and first slide is a poll result slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><span id='poll_rate_1' class='poll_response_rate'></span></div></div>")
    spyOn(Slide.prototype, 'updatePoll');
	  
    var slideShow = new SlideShow(queryAll('.slide'))

    expect(Slide.prototype.updatePoll).toHaveBeenCalled();

  });	  

  it("should update coding slide when slideshow is initialized and first slide is a coding slide", function() {

    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='code_output'><div class='slide'/></div>")	  
    spyOn(Slide.prototype, 'updateCodingSlide');

    var slideShow = new SlideShow(queryAll('.slide'))

    expect(Slide.prototype.updateCodingSlide.calls.length).toBe(1);    
    expect(Slide.prototype.updateCodingSlide).toHaveBeenCalledWith(slideShow._currentIndex);   	  

  });  
  
  it("should update coding slide when synchronise is called", function() {

    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='code_output'><div class='slide'/></div>")	  
    spyOn(Slide.prototype, 'updateCodingSlide');

    var slideShow = new SlideShow(queryAll('.slide'))	  
    slideShow.synchronise();

    expect(Slide.prototype.updateCodingSlide.calls.length).toBe(2);  // initialized and synchronised
    expect(Slide.prototype.updateCodingSlide).toHaveBeenCalledWith(slideShow._currentIndex);    

  });  
  
  it("should update coding slide when slide down is called", function() {

    setFixtures("<div class='slides'><div class='slide'></div><div class='slide'><div id='code_input'><div id='execute'><div id='code_output'><div class='slide'/></div>")	  
    spyOn(Slide.prototype, 'updateCodingSlide');

    var slideShow = new SlideShow(queryAll('.slide'))	  
    slideShow.down();

    expect(Slide.prototype.updateCodingSlide.calls.length).toBe(1);  // initialized and synchronised
    expect(Slide.prototype.updateCodingSlide).toHaveBeenCalledWith(slideShow._currentIndex);    

  });    

  it("should update coding slide when synchronised and slide is down (i.e. coding slide is visible)", function() {

    setFixtures("<div class='slides'><div class='slide'></div><div class='slide'></div><div class='slide'><div id='code_input'><div id='execute'><div id='code_output'><div class='slide'/></div>")	  
    spyOn(Slide.prototype, 'updateCodingSlide');

    var slideShow = new SlideShow(queryAll('.slide')) // updateCodingSlide not call because not first slide	  
    slideShow.down();
    slideShow.synchronise();

    expect(Slide.prototype.updateCodingSlide.calls.length).toBe(2); // down + synchronise     
    expect(Slide.prototype.updateCodingSlide).toHaveBeenCalledWith(slideShow._currentIndex);    

  });  

  it("should not update slideshow state if slide down (i.e. coding slide is visible)", function() {
	  
   setFixtures("<div class='slides'><div class='slide'></div><div class='slide'></div><div class='slide'><div id='code_input'><div class='code_helper'></div><div class='code_helper'></div><div id='execute'><div id='code_output'></div></div>")	  
   spyOn(SlideShow.prototype, '_show_current_slide');
	  
    var slideShow = new SlideShow(queryAll('.slide'))

    expect(SlideShow.prototype._show_current_slide.calls.length).toBe(1);

    slideShow.down();

    slideShow.next(); 
    expect(SlideShow.prototype._show_current_slide.calls.length).toBe(1);

    slideShow.prev();  
    expect(SlideShow.prototype._show_current_slide.calls.length).toBe(1);
	  
    slideShow.synchronise();  
    expect(SlideShow.prototype._show_current_slide.calls.length).toBe(1);    

    slideShow.up();
    expect(SlideShow.prototype._show_current_slide.calls.length).toBe(2);	  
	  
    slideShow.next(); 
    expect(SlideShow.prototype._show_current_slide.calls.length).toBe(3);

    slideShow.prev();  
    expect(SlideShow.prototype._show_current_slide.calls.length).toBe(4);

    slideShow.synchronise();  
    expect(SlideShow.prototype._show_current_slide.calls.length).toBe(5);

  });   

});
