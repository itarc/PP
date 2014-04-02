describe("SlideShow with a Poll Slide", function() {
  
  it("should be updated when first slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><span id='poll_rate_1' class='poll_response_rate'></span></div></div>")
    spyOn(PollSlide.prototype, '_update');
	  
    var slideShow = new SlideShow(queryAll(document, '.slide'))

    expect(PollSlide.prototype._update).toHaveBeenCalled();

  });	  

});
