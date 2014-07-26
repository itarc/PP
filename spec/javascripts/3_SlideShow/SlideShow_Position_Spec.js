describe("SlideShow Position Update with Teacher Position", function() {
  
  beforeEach(function () {
    slideshow = new SlideShow([]);    
  });
  
  it("should be first slide when initialized", function() {
    expect(slideshow.position._currentIndex).toBe(0);
    expect(slideshow.position._IDEDisplayed).toBe(false);
  });
  
  it("should NOT change if server unavailable", function() {
    slideshow.position.updateWithTeacherPosition(); // Can not call the server since getResource is not spyed 

    expect(slideshow.position._currentIndex).toBe(0);
    expect(slideshow.position._IDEDisplayed).toBe(false);  
  });  
  
  it("should NOT be updated when slideIndex is unknown", function() {
    getResource = jasmine.createSpy('getResource').andReturn('UNKNOWN;true');
    
    slideshow.position.updateWithTeacherPosition();    

    expect(slideshow.position._currentIndex).toBe(0);
    expect(slideshow.position._IDEDisplayed).toBe(true);
  });  
  
  it("should NOT be updated when IDEDisplay is unknown", function() {    
    getResource = jasmine.createSpy('getResource').andReturn('0;UNKNOWN');
    
    slideshow.position.updateWithTeacherPosition();    

    expect(slideshow.position._currentIndex).toBe(0);
    expect(slideshow.position._IDEDisplayed).toBe(false);    
  });  
  
  it("should NOT be updated when slideIndex is unknown and IDEDisplay is unknown", function() {
    getResource = jasmine.createSpy('getResource').andReturn('UNKNOWN;UNKNOWN');
    
    slideshow.position.updateWithTeacherPosition();    

    expect(slideshow.position._currentIndex).toBe(0);
    expect(slideshow.position._IDEDisplayed).toBe(false);
  });  

  it("should get current position on server when synchronised", function() {
    getResource = jasmine.createSpy('getResource').andReturn('1;false');  
    
    slideshow.position.updateWithTeacherPosition();

    expect(slideshow.position._currentIndex).toBe(1);
    expect(slideshow.position._IDEDisplayed).toBe(false);
  });  
  
  it("should get slideshow position on server", function() {    
    getResource = jasmine.createSpy('postResource').andReturn('1;false');
    
    p = slideshow.position._getPosition();
	  
    expect(getResource.calls.length).toBe(1);
    expect(getResource).toHaveBeenCalledWith('/teacher_current_slide');
    expect(p).toBe('1;false');
  });

});
  
describe("SlideShow Position UpdateWith", function() {
  
  beforeEach(function () {
    spyOn(Position.prototype, "_getPosition").andReturn("0;false"); 
    slideshow = new SlideShow([]);
  });  
  
  it("should post position on server", function() {    
    postResource = jasmine.createSpy('postResource');   

    slideshow.position.updateWith(1, true);
	  
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + '1' + '&' + 'ide_displayed=' + true, ASYNCHRONOUS);
  });   
  
  it("should update slidshow position when different from current position", function() {    
    spyOn(SlideShow.prototype, "_update");
    expect(SlideShow.prototype._update.calls.length).toBe(0);    

    slideshow.position.updateWith(1, true);

    expect(SlideShow.prototype._update.calls.length).toBe(1);
  });   
  
  it("should NOT update slidshow position when NOT different from current position", function() {    
    spyOn(SlideShow.prototype, "_update");
    expect(SlideShow.prototype._update.calls.length).toBe(0);    

    slideshow.position.updateWith(1, true);
	  
    expect(SlideShow.prototype._update.calls.length).toBe(1);

    slideshow.position.updateWith(1, true);
	  
    expect(SlideShow.prototype._update.calls.length).toBe(1);
  });   

});