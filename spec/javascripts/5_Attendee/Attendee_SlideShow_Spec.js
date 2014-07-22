IDE_slideshow = 
"<div class='slides'>"+
"<div class='slide'>"+
"<div id='code_input'>"+
"<div id='execute'>"+
"<div id='send_code'/>"+
"<div id='get_code'/>"+
"<div id='code_output'>"+
"<div class='slide'/>"+
"</div>"

describe("SlideShow with an IDE Slide", function() {  
  
  beforeEach(function() {
    setFixtures(IDE_slideshow)	  
    spyOn(AttendeeCodeSlide.prototype, '_update');    
  });
  
  it("should be updated when initialized", function() {
    var slideShow = new AttendeeSlideShow(queryAll(document, '.slide'));
    
    expect(AttendeeCodeSlide.prototype._update.calls.length).toBe(1);    
   });  

  it("should be updated when refreshed and position changed", function() {
    var slideShow = new AttendeeSlideShow(queryAll(document, '.slide'))

    expect(slideShow.position._currentIndex).toBe(0);     
    getResource = jasmine.createSpy('getResource').andReturn('11');
    slideShow._refresh();
   
    expect(AttendeeCodeSlide.prototype._update.calls.length).toBe(2); // init + _refresh
 
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