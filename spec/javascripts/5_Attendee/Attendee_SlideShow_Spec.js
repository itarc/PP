ATTENDEE_SLIDESHOW_WITH_1_IDE_SLIDE_ONLY =  
"<div class='slides'>"+
HEADER + 
code_input + 
code_helpers + 
author_bar +
buttons + 
code_ouput + 
FOOTER +
"/div"

describe("AttendeeSlideShow IDE Slide", function() {  
  
  beforeEach(function() {
    setFixtures(ATTENDEE_SLIDESHOW_WITH_1_IDE_SLIDE_ONLY)	  
    spyOn(AttendeeCodeSlide.prototype, '_update');    
  });
  
  it("should be updated when initialized", function() {
    var slideShow = new AttendeeSlideShow(queryAll(document, '.slide'));
    
    expect(AttendeeCodeSlide.prototype._update.calls.length).toBe(1);    
   });  

  it("should be updated when refreshed and position changed", function() {
    var slideShow = new AttendeeSlideShow(queryAll(document, '.slide'))

    expect(slideShow._currentIndex).toBe(0);     
    getResource = jasmine.createSpy('getResource').andReturn('11');
    slideShow._refresh();
   
    expect(AttendeeCodeSlide.prototype._update.calls.length).toBe(2); // init + _refresh
   });
   
  it("should show IDE Slide (index 0) even if teacher slide is on another slide (index > 0)", function() {
    getResource = jasmine.createSpy('getResource').andReturn('11;false');    
    var slideShow = new AttendeeSlideShow(queryAll(document, '.slide'))

    expect(slideShow._currentIndex).toBe(11);
    expect(slideShow._currentSlide).toBe(slideShow._slides[0]);
  });   

  it("should NOT be updated when refreshed but position did not change", function() {
    getResource = jasmine.createSpy('getResource').andReturn('0;false');
    var slideShow = new AttendeeSlideShow(queryAll(document, '.slide'))     

    expect(AttendeeCodeSlide.prototype._update.calls.length).toBe(1);
    
    expect(slideShow.position._currentIndex).toBe(0);
    
    slideShow._refresh();

    expect(AttendeeCodeSlide.prototype._update.calls.length).toBe(1);
  });
  
  it("should prevent default when key pressed on editor", function() {
    var slideShow = new AttendeeSlideShow(queryAll(document, '.slide'));
    preventDefaultKeys = jasmine.createSpy('preventDefaultKeys');

    expect(preventDefaultKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(slideShow._slides[0]._node.querySelector('#code_input'), F5);

    expect(preventDefaultKeys.calls.length).toBe(1);
  });  

});