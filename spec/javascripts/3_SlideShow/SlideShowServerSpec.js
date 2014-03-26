describe("SlideShow Server", function() {
  
  it("should return current teacher index", function() {
	  
    var slideShowServer = new SlideShowServer();

    getResource = jasmine.createSpy('getResource').andReturn('1');  

    expect(slideShowServer.getCurrentIndex()).toBe(1);

  });  
  
  it("should NOT return current teacher index if server index is not an Index", function() {
	  
    var slideShowServer = new SlideShowServer();
    
    expect(slideShowServer._currentServerIndex).toBe(0);

    getResource = jasmine.createSpy('getResource').andReturn('UNKNOWN');  

    expect(slideShowServer.getCurrentIndex()).toBe(0);

  });

    it("should post current slide index on server", function() {

    postResource = jasmine.createSpy('postResource');
	  
    var slideShowServer = new SlideShowServer();

    slideShowServer.postCurrentIndex(5);
	  
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + '5', ASYNCHRONOUS);

  });

});