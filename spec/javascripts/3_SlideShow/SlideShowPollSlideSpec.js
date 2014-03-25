describe("SlideShow Poll Slide", function() {
  
  it("should be updated when slideshow is initialized and first slide is a poll result slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><span id='poll_rate_1' class='poll_response_rate'></span></div></div>")
    spyOn(PollSlide.prototype, '_update');
	  
    var slideShow = new SlideShow(queryAll(document, '.slide'))

    expect(PollSlide.prototype._update).toHaveBeenCalled();

  });	  

});
