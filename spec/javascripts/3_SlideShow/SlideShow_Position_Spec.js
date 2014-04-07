describe("Slide Position", function() {
  
  it("should get teacher current position when synchronised", function() {
	  
    var position = new Position();

    getResource = jasmine.createSpy('getResource').andReturn('1;false');  
    
    position._synchronise();

    expect(position._currentIndex).toBe(1);
    expect(position._IDEDisplayed).toBe(false);

  });  

  it("should post slideshow current position", function() {
	  
    var position = new Position();
    
    postResource = jasmine.createSpy('postResource');  

    position._currentIndex = 5;
    position._IDEDisplayed = true     

    position.postCurrentIndex();
	  
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/teacher_current_slide', 'index=' + '5' + '&' + 'ide_displayed=' + true, ASYNCHRONOUS);

  });  
  
  it("should NOT be update when position is unknown", function() {
	  
    var position = new Position();
    
    expect(position._currentIndex).toBe(0);
    expect(position._IDEDisplayed).toBe(false);

    getResource = jasmine.createSpy('getResource').andReturn('UNKNOWN;UNKNOWN');
    
    position._synchronise();    

    expect(position._currentIndex).toBe(0);
    expect(position._IDEDisplayed).toBe(false);
    
    getResource = jasmine.createSpy('getResource').andReturn('UNKNOWN;true');
    
    position._synchronise();    

    expect(position._currentIndex).toBe(0);
    expect(position._IDEDisplayed).toBe(false); 

    getResource = jasmine.createSpy('getResource').andReturn('0;UNKNOWN');
    
    position._synchronise();    

    expect(position._currentIndex).toBe(0);
    expect(position._IDEDisplayed).toBe(false);    

  });
  
  it("should tell if position has changed", function() {
	  
    var position = new Position(); 
    
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