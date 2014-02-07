describe("SlideShow Code Slide", function() {  

  it("should  be updated when when slideshow is initialized and first slide is a coding slide", function() {

    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='code_output'><div class='slide'/></div>")	  
    spyOn(CodeSlide.prototype, 'updateCodingSlideHelpers');

    var slideShow = new SlideShow(queryAll('.slide'))

    expect(CodeSlide.prototype.updateCodingSlideHelpers.calls.length).toBe(1);    
    //~ expect(CodeSlide.prototype.updateCodingSlideHelpers).toHaveBeenCalledWith(slideShow._currentIndex);   	  

  });  
  
  it("should be updated when when synchronise is called", function() {

    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='code_output'><div class='slide'/></div>")	  
    spyOn(CodeSlide.prototype, 'updateCodingSlideHelpers');

    var slideShow = new SlideShow(queryAll('.slide'))	  
    slideShow.synchronise();

    expect(CodeSlide.prototype.updateCodingSlideHelpers.calls.length).toBe(2);  // initialized and synchronised
    //~ expect(CodeSlide.prototype.updateCodingSlideHelpers).toHaveBeenCalledWith(slideShow._currentIndex);    

  });  
  
  it("should be updated when slide down is called", function() {

    setFixtures("<div class='slides'><div class='slide'></div><div class='slide'><div id='code_input'/><div id='execute'/><div id='code_output'/></div></div>")	  
    spyOn(CodeSlide.prototype, 'updateCodingSlideHelpers');

    var slideShow = new SlideShow(queryAll('.slide'))	  
    slideShow.down();	  
    expect(CodeSlide.prototype.updateCodingSlideHelpers.calls.length).toBe(1);  // initialized and synchronised
    //~ expect(CodeSlide.prototype.updateCodingSlideHelpers).toHaveBeenCalledWith(slideShow._currentIndex);    

  });    

  it("should be updated when synchronised is called and slide is down (i.e. coding slide is visible)", function() {

    setFixtures("<div class='slides'><div class='slide'></div><div class='slide'></div><div class='slide'><div id='code_input'/><div id='execute'/><div id='code_output'/></div></div>")
    spyOn(CodeSlide.prototype, 'updateCodingSlideHelpers');

    var slideShow = new SlideShow(queryAll('.slide')) // updateCodingSlideHelpers not call because not first slide	  
    slideShow.down();
    slideShow.synchronise();

    expect(CodeSlide.prototype.updateCodingSlideHelpers.calls.length).toBe(2); // down + synchronise     
    //~ expect(CodeSlide.prototype.updateCodingSlideHelpers).toHaveBeenCalledWith(slideShow._currentIndex);    

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
