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

  it("should update coding slide when slideshow is initialized", function() {

    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='code_output'><div class='slide'/></div>")	  
    spyOn(Slide.prototype, 'updateCodingSlide');

    var slideShow = new SlideShow(queryAll('.slide'))

    expect(Slide.prototype.updateCodingSlide.calls.length).toBe(1);    
    expect(Slide.prototype.updateCodingSlide).toHaveBeenCalledWith(slideShow._currentIndex);   	  

  });  
  
  it("should update coding slide when synchronised", function() {

    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='code_output'><div class='slide'/></div>")	  
    spyOn(Slide.prototype, 'updateCodingSlide');

    var slideShow = new SlideShow(queryAll('.slide'))	  
    slideShow.synchronise();

    expect(Slide.prototype.updateCodingSlide.calls.length).toBe(2);  // initialized and synchronised
    expect(Slide.prototype.updateCodingSlide).toHaveBeenCalledWith(slideShow._currentIndex);    

  });  
  
  it("should update coding slide when slide is down", function() {

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
