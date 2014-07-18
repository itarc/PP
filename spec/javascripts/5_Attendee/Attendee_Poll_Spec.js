describe("AttendeeSlideShow with a Poll Slide", function() {
  
  it("should be updated when first slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><span id='poll_rate_1' class='poll_response_rate'></span></div></div>")
    spyOn(AttendeePollSlide.prototype, '_update');
	  
    var attendeeSlideShow = new AttendeeSlideShow(queryAll(document, '.slide'))

    expect(AttendeePollSlide.prototype._update).toHaveBeenCalled();

  });	  

})