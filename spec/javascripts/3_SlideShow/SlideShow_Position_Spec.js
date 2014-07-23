describe("Slide Position", function() {
  
  beforeEach(function () {
    position = new Position();
  });
  
  it("should be first slide when initialized", function() {
    expect(position._currentIndex).toBe(0);
    expect(position._IDEDisplayed).toBe(false);
  });
  
  it("should not change if server unavailable", function() {
    position._synchronise(); // Can not call the server since getResource is not spyed 

    position._synchronise();    

    expect(position._currentIndex).toBe(0);
    expect(position._IDEDisplayed).toBe(false);  
  });  
  
  it("should NOT be updated when slideIndex is unknown", function() {
    getResource = jasmine.createSpy('getResource').andReturn('UNKNOWN;true');
    
    position._synchronise();    

    expect(position._currentIndex).toBe(0);
    expect(position._IDEDisplayed).toBe(false);
  });  
  
  it("should NOT be updated when IDEDisplay is unknown", function() {    
    getResource = jasmine.createSpy('getResource').andReturn('0;UNKNOWN');
    
    position._synchronise();    

    expect(position._currentIndex).toBe(0);
    expect(position._IDEDisplayed).toBe(false);    
  });  
  
  it("should NOT be updated when slideIndex is unknown and IDEDisplay is unknown", function() {
    getResource = jasmine.createSpy('getResource').andReturn('UNKNOWN;UNKNOWN');
    
    position._synchronise();    

    expect(position._currentIndex).toBe(0);
    expect(position._IDEDisplayed).toBe(false);
  });  

  it("should get current position on server when synchronised", function() {
    getResource = jasmine.createSpy('getResource').andReturn('1;false');  
    
    position._synchronise();

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

  it("should post slideshow current position", function() {    
    postResource = jasmine.createSpy('postResource');   

    position.postPosition(1, true);
	  
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + '1' + '&' + 'ide_displayed=' + true, ASYNCHRONOUS);
  });  
  
  it("should tell if position has changed", function() {
    expect(position._currentIndex).toBe(0);
    expect(position._IDEDisplayed).toBe(false);
    
    expect(position.hasChanged()).toBe(true);   

    getResource = jasmine.createSpy('getResource').andReturn('0;false');
    
    position._synchronise();

    expect(position.hasChanged()).toBe(false);    
    
    getResource = jasmine.createSpy('getResource').andReturn('1;false');
    
    position._synchronise();

    expect(position.hasChanged()).toBe(true);
    
    getResource = jasmine.createSpy('getResource').andReturn('0;true');
    
    position._synchronise();

    expect(position.hasChanged()).toBe(true);    
    
    getResource = jasmine.createSpy('getResource').andReturn('0;false');
    
    position._synchronise();

    expect(position.hasChanged()).toBe(true);
  });   

});