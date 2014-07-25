describe("Position", function() {
  
  beforeEach(function () {
    position = new Position();
  });
  
  it("should be first slide when initialized", function() {
    expect(position._currentIndex).toBe(0);
    expect(position._IDEDisplayed).toBe(false);
  });
  
  it("should NOT change if server unavailable", function() {
    position._update(); // Can not call the server since getResource is not spyed 

    expect(position._currentIndex).toBe(0);
    expect(position._IDEDisplayed).toBe(false);  
  });  
  
  it("should NOT be updated when slideIndex is unknown", function() {
    getResource = jasmine.createSpy('getResource').andReturn('UNKNOWN;true');
    
    position._update();    

    expect(position._currentIndex).toBe(0);
    expect(position._IDEDisplayed).toBe(false);
  });  
  
  it("should NOT be updated when IDEDisplay is unknown", function() {    
    getResource = jasmine.createSpy('getResource').andReturn('0;UNKNOWN');
    
    position._update();    

    expect(position._currentIndex).toBe(0);
    expect(position._IDEDisplayed).toBe(false);    
  });  
  
  it("should NOT be updated when slideIndex is unknown and IDEDisplay is unknown", function() {
    getResource = jasmine.createSpy('getResource').andReturn('UNKNOWN;UNKNOWN');
    
    position._update();    

    expect(position._currentIndex).toBe(0);
    expect(position._IDEDisplayed).toBe(false);
  });  

  it("should get current position on server when synchronised", function() {
    getResource = jasmine.createSpy('getResource').andReturn('1;false');  
    
    position._update();

    expect(position._currentIndex).toBe(1);
    expect(position._IDEDisplayed).toBe(false);
  });  
  
  it("should get slideshow position on server", function() {    
    getResource = jasmine.createSpy('postResource').andReturn('1;false');
    
    p = position.getPosition();
	  
    expect(getResource.calls.length).toBe(1);
    expect(getResource).toHaveBeenCalledWith('/teacher_current_slide');
    expect(p).toBe('1;false');
  });

});
  
describe("SlideShow Post Position", function() {
  
  beforeEach(function () {
    spyOn(Position.prototype, "getPosition").andReturn("0;false"); 
    slideshow = new SlideShow([]);
  });  
  
  it("should post slideshow current position", function() {    
    postResource = jasmine.createSpy('postResource');   

    slideshow.position.postPosition(1, true);
	  
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + '1' + '&' + 'ide_displayed=' + true, ASYNCHRONOUS);
  });   
  
  it("should posted position when different from current position ", function() {    
    spyOn(SlideShow.prototype, "_update");
    expect(SlideShow.prototype._update.calls.length).toBe(0);    

    slideshow.position.postPosition(1, true);

    expect(SlideShow.prototype._update.calls.length).toBe(1);
  });   
  
  it("should NOT update slideshow when position posted and NOT different from current position ", function() {    
    spyOn(SlideShow.prototype, "_update");
    expect(SlideShow.prototype._update.calls.length).toBe(0);    

    slideshow.position.postPosition(1, true);
	  
    expect(SlideShow.prototype._update.calls.length).toBe(1);

    slideshow.position.postPosition(1, true);
	  
    expect(SlideShow.prototype._update.calls.length).toBe(1);
  });   

});