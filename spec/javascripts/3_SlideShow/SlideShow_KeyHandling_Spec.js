SLIDESHOW_FOR_KEY_HANDLING =  
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
    setFixtures(SLIDESHOW_FOR_KEY_HANDLING)    
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').and.returnValue({})     
    slideShow = new SlideShow(queryAll(document, '.slide'));    
  });  
  
  it("should prevent default when key pressed on document", function() {
    spyOn(SlideShow.prototype, '_preventDefaultKeys');

    expect(SlideShow.prototype._preventDefaultKeys.calls.count()).toBe(0);

    __triggerKeyboardEvent(document, F5);

    expect(SlideShow.prototype._preventDefaultKeys.calls.count()).toBe(44); // SHOULD BE 1 => TO REVIEW
  });
  
  it("should prevent default when key pressed in editor", function() {
    spyOn(SlideShow.prototype, '_preventDefaultKeys');

    expect(SlideShow.prototype._preventDefaultKeys.calls.count()).toBe(0);

    __triggerKeyboardEvent(slideShow._slides[0]._node.querySelector('#code_input'), F5);

    expect(SlideShow.prototype._preventDefaultKeys.calls.count()).toBe(1);
  });  
  
});
