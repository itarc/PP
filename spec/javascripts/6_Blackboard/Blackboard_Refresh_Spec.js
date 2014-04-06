describe("Balckboard Refresh", function() {
  
  it("should get last Teacher run", function() {
    
    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div class='code_helper'><div class='code_helper'><div id='execute'><div id='send_code'/><div id='get_code'/><div id='code_output'><div class='slide'/></div>")	      
    
    var blackboardSlideShow = new BlackboardSlideShow(queryAll(document, '.slide'));

    spyOn(CodeSlide.prototype, 'executeCode');
    getResource = jasmine.createSpy('getResource').andReturn('last teacher run');

    blackboardSlideShow._slides[0]._editor.updateEditor("");
  
    blackboardSlideShow._refresh();

    expect(getResource).toHaveBeenCalledWith('/code_get_last_teacher_run/0');    
    expect(blackboardSlideShow._slides[0]._editor.content()).toBe('last teacher run');    
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(1);


  });  
  
  it("should NOT refresh when last execution equals code in code editor", function() {
    
    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div class='code_helper'><div class='code_helper'><div id='execute'><div id='send_code'/><div id='get_code'/><div id='code_output'><div class='slide'/></div>")	      
    
    var blackboardSlideShow = new BlackboardSlideShow(queryAll(document, '.slide'));

    spyOn(CodeSlide.prototype, 'executeCode');      
    spyOn(CodeSlide.prototype, 'lastExecution').andReturn('last execution');

    blackboardSlideShow._slides[0]._editor.updateEditor("");
  
    blackboardSlideShow._refresh();
    
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(1);
    
    blackboardSlideShow._slides[0]._editor.updateEditor("last execution");
    
    blackboardSlideShow._refresh();
    
    expect(CodeSlide.prototype.executeCode.calls.length).toBe(1);
    
  });
  
  it("should NOT show current slide if no change", function() {
    
    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div class='code_helper'><div class='code_helper'><div id='execute'><div id='send_code'/><div id='get_code'/><div id='code_output'><div class='slide'/></div>")	      
    
    var blackboardSlideShow = new BlackboardSlideShow(queryAll(document, '.slide'));

    spyOn(BlackboardSlideShow.prototype, '_showCurrentSlide');
    
    getResource = jasmine.createSpy('getResource').andReturn('1;false');
    
    blackboardSlideShow._refresh();
    
    expect(BlackboardSlideShow.prototype._showCurrentSlide.calls.length).toBe(1);
    
    blackboardSlideShow._refresh();
    
    expect(BlackboardSlideShow.prototype._showCurrentSlide.calls.length).toBe(1);
    
  });  
  
  it("should refresh position every second", function() {
	  
    spyOn(BlackboardSlideShow.prototype, '_refresh');
    jasmine.Clock.useMock();

    setInterval( function(){ blackboardSlideShow._refresh(); },1000); // Mandatory even if it is already done in the javascript

    expect(BlackboardSlideShow.prototype._refresh.callCount).toEqual(0);
    jasmine.Clock.tick(1001);
    expect(BlackboardSlideShow.prototype._refresh.callCount).toEqual(1);
    
    expect(slideshowTimer).toBeDefined(); // Test if timer is javascript

  });  

});
