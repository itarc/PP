describe("AttendeeSlideShow with an IDE Slide", function() {  
  
  beforeEach(function() {

    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='send_code'/><div id='get_code'/><div id='code_output'><div class='slide'/></div>")	  
    spyOn(CodeSlide.prototype, '_update');    
    
  });  

  it("should be updated when first slide", function() {

    getResource = jasmine.createSpy('getResource').andReturn('0');    

    var attendeeSlideShow = new AttendeeSlideShow(queryAll(document, '.slide'))

    expect(CodeSlide.prototype._update.calls.length).toBe(1);     	  

  });
  
});