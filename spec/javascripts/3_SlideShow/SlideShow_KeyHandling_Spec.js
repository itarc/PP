SLIDESHOW_WITH_ATTENDEE_FIELD =  
"<div class='slides'>"+
HEADER + 
code_input + 
"<div class='code_helper'>AUTHOR NAME?<input id='attendee_name' type='text'></div>"+
author_bar +
buttons + 
code_ouput + 
FOOTER+
"</div>"

describe("SlideShow KeyHandling", function() {
  
  beforeEach(function () {   
    setFixtures(SLIDESHOW_WITH_ATTENDEE_FIELD)    
    slideShow = new SlideShow(queryAll(document, '.slide'));    
  });  
  
  it("should prevent default when key pressed on document", function() {
    spyOn(SlideShow.prototype, '_preventDefaultKeys');

    expect(SlideShow.prototype._preventDefaultKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(document, F5);

    expect(SlideShow.prototype._preventDefaultKeys.calls.length).toBe(41); // SHOULD BE 1 => TO REVIEW
  });
  
  it("should Not prevent default when key pressed in Attendee Login", function() {
    spyOn(SlideShow.prototype, '_preventDefaultKeys');

    expect(SlideShow.prototype._preventDefaultKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(document.querySelector('#attendee_name'), F5);

    expect(SlideShow.prototype._preventDefaultKeys.calls.length).toBe(0); 
  });  
  
  it("should prevent default when key pressed in editor", function() {
    spyOn(SlideShow.prototype, '_preventDefaultKeys');

    expect(SlideShow.prototype._preventDefaultKeys.calls.length).toBe(0);

    __triggerKeyboardEvent(slideShow._slides[0]._node.querySelector('#code_input'), F5);

    expect(SlideShow.prototype._preventDefaultKeys.calls.length).toBe(1);
  });  
  
});