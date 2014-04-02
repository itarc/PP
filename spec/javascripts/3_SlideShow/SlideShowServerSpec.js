describe("SlideShow Server", function() {
  
  it("should get teacher current position when synchronised", function() {
	  
    var slideShowServer = new SlideShowServer();

    getResource = jasmine.createSpy('getResource').andReturn('1;false');  
    
    slideShowServer._synchronise();

    expect(slideShowServer._currentServerIndex).toBe(1);
    expect(slideShowServer._IDEDisplayed).toBe(false);

  });  

  it("should post slideshow current position", function() {

    postResource = jasmine.createSpy('postResource');
	  
    var slideShowServer = new SlideShowServer();

    slideShowServer.postCurrentIndex(5, SlideShow.prototype._showIDE);
	  
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + '5' + '&' + 'ide_displayed=' + SlideShow.prototype._showIDE, ASYNCHRONOUS);

  });  
  
  it("should NOT return current teacher position when position is unknown", function() {
	  
    var slideShowServer = new SlideShowServer();
    
    expect(slideShowServer._currentServerIndex).toBe(0);
    expect(slideShowServer._IDEDisplayed).toBe(false);

    getResource = jasmine.createSpy('getResource').andReturn('UNKNOWN;UNKNOWN');
    
    slideShowServer._synchronise();    

    expect(slideShowServer._currentServerIndex).toBe(0);
    expect(slideShowServer._IDEDisplayed).toBe(false);
    
    getResource = jasmine.createSpy('getResource').andReturn('UNKNOWN;true');
    
    slideShowServer._synchronise();    

    expect(slideShowServer._currentServerIndex).toBe(0);
    expect(slideShowServer._IDEDisplayed).toBe(false); 

    getResource = jasmine.createSpy('getResource').andReturn('0;UNKNOWN');
    
    slideShowServer._synchronise();    

    expect(slideShowServer._currentServerIndex).toBe(0);
    expect(slideShowServer._IDEDisplayed).toBe(false);    

  });

});