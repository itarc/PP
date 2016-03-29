describe("SlideShow Position Update with Teacher Position", function() {
  
  beforeEach(function () {
    getResource = jasmine.createSpy('getResource').and.returnValue('0;false');
    slideshow = new SlideShow([]);
  });
  
  it("should be teacher position when initialized", function() {
    expect(slideshow.position._currentIndex).toBe(0);
    expect(slideshow.position._IDEDisplayed).toBe(false);
  });
  
  it("should NOT change if server unavailable", function() {
    slideshow.position.updateWithTeacherPosition(); // Can not call the server since getResource is not spyed 

    expect(slideshow.position._currentIndex).toBe(0);
    expect(slideshow.position._IDEDisplayed).toBe(false);  
  });  
  
  it("should NOT be updated when slideIndex is unknown", function() {
    spyOn(Position.prototype, "_getPosition").and.returnValue('UNKNOWN;true');    
    
    slideshow.position.updateWithTeacherPosition();    

    expect(slideshow.position._currentIndex).toBe(0);
    expect(slideshow.position._IDEDisplayed).toBe(true);
  });  
  
  it("should NOT be updated when IDEDisplay is unknown", function() {    
    spyOn(Position.prototype, "_getPosition").and.returnValue('0;UNKNOWN');        
    
    slideshow.position.updateWithTeacherPosition();    

    expect(slideshow.position._currentIndex).toBe(0);
    expect(slideshow.position._IDEDisplayed).toBe(false);    
  });  
  
  it("should NOT be updated when slideIndex is unknown and IDEDisplay is unknown", function() {
    spyOn(Position.prototype, "_getPosition").and.returnValue('UNKNOWN;UNKNOWN');  
    
    slideshow.position.updateWithTeacherPosition();    

    expect(slideshow.position._currentIndex).toBe(0);
    expect(slideshow.position._IDEDisplayed).toBe(false);
  });  

  it("should get current position on server when synchronised", function() {
    spyOn(Position.prototype, "_getPosition").and.returnValue('1;false');      
    
    slideshow.position.updateWithTeacherPosition();

    expect(slideshow.position._currentIndex).toBe(1);
    expect(slideshow.position._IDEDisplayed).toBe(false);
  });  
  
  it("should get slideshow position on server Synchronous", function() {     
    spyOn(Resource.prototype, "get").and.returnValue('1;false');
    
    p = slideshow.position._getPosition();
	  
    expect(Resource.prototype.get.calls.count()).toBe(1);
    expect(Resource.prototype.get).toHaveBeenCalledWith('/teacher_current_slide');
    expect(p).toBe('1;false');  
  }); 
  
  it("should get slideshow position on server ASYNCHRONOUS", function() {
    spyOn(Resource.prototype, "_xmlhttpResponseText").and.returnValue('9121;true')   
    spyOn(Resource.prototype, "_asynchronousRequestDone").and.returnValue(true)
    
    spyOn(Position.prototype, "_updateSlideShowWith").and.callThrough();

    slideshow.position._getPosition(ASYNCHRONOUS);
	  
    expect(Position.prototype._updateSlideShowWith).toHaveBeenCalledWith('9121;true');
    expect(slideshow.position._currentIndex).toBe(9121);
    expect(slideshow.position._IDEDisplayed).toBe(true); 
  });  

});
  
describe("SlideShow Position UpdateWith", function() {
  
  beforeEach(function () {
    spyOn(Position.prototype, "_getPosition").and.returnValue("0;false"); 
    slideshow = new SlideShow([]);
  });  
  
  it("should post position on server", function() {      
    spyOn(Resource.prototype, "post");  

    slideshow.position.updateWith(1, true);

    expect(Resource.prototype.post.calls.count()).toBe(1);
    expect(Resource.prototype.post).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + '1' + '&' + 'ide_displayed=' + true, ASYNCHRONOUS);    
  });   
  
  it("should update slidshow position when different from current position", function() {    
    spyOn(SlideShow.prototype, "_update");
    expect(SlideShow.prototype._update.calls.count()).toBe(0);    

    slideshow.position.updateWith(1, true);

    expect(SlideShow.prototype._update.calls.count()).toBe(1);
  });   
  
  it("should NOT update slidshow position when NOT different from current position", function() {    
    spyOn(SlideShow.prototype, "_update");
    expect(SlideShow.prototype._update.calls.count()).toBe(0);    

    slideshow.position.updateWith(1, true);
	  
    expect(SlideShow.prototype._update.calls.count()).toBe(1);

    slideshow.position.updateWith(1, true);
	  
    expect(SlideShow.prototype._update.calls.count()).toBe(1);
  });   

});
