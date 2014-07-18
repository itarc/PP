describe("TeacherSlideShow with a Poll Slide", function() {
  
  it("should be updated when first slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><span id='poll_rate_1' class='poll_response_rate'></span></div></div>")
    spyOn(TeacherPollSlide.prototype, '_update');
	  
    var teacherSlideShow = new TeacherSlideShow(queryAll(document, '.slide'))

    expect(TeacherPollSlide.prototype._update.calls.length).toBe(1);

  });	  

});