describe("Slide", function() {

  it("should create one slide object", function() {
	  
    slideNode = sandbox("<div class='slide'></div>");
    expect(slideNode).toHaveClass('slide');
	  
    var slide = new Slide(slideNode);
	  
    expect(slide._node).not.toBeUndefined();
    expect(slide._node).toBe(slideNode);
    
  });
  
  it("should set slide state to current", function() {
	  
    slideNode = sandbox("<div class='slide'></div>");
    var slide = new Slide(slideNode);

    expect(slide._node.className).toBe('slide');
    slide.setState('current')
    expect(slide._node.className).toBe('slide current');
    
  });  

  it("should set slide state to next", function() {
	  
    slideNode = sandbox("<div class='slide current'></div>");
    var slide = new Slide(slideNode);

    expect(slide._node.className).toBe('slide current');
	  
    slide.setState('next')
	  
    expect(slide._node.className).toBe('slide next');
    
  });  

   it("should set slide state to previous", function() {
	  
    slideNode = sandbox("<div class='slide current'></div>");
    var slide = new Slide(slideNode);

    expect(slide._node.className).toBe('slide current');
	   
    slide.setState('previous')
	   
    expect(slide._node.className).toBe('slide previous');
    
  });   
  
  it("should set slide state to none", function() {
	  
    slideNode = sandbox("<div class='slide xxx'></div>");
    var slide = new Slide(slideNode);

    expect(slide._node.className).toBe('slide xxx');
    slide.setState('')
    expect(slide._node.className).toBe('slide');
    
  });  
  
});

