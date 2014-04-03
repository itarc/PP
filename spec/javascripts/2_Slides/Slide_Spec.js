describe("Slide", function() {
  
  it("should clear slide state", function() {
	  
    slideNode = sandbox("<div class='slide xxx'></div>");
    var slide = new Slide(slideNode);

    expect(slide._node.className).toBe('slide xxx');
    slide.setState('')
    expect(slide._node.className).toBe('slide');
    
  });  
  
  it("should set slide state", function() {
	  
    slideNode = sandbox("<div class='slide'></div>");
    var slide = new Slide(slideNode);

    expect(slide._node.className).toBe('slide');
    slide.setState('yyy')
    expect(slide._node.className).toBe('slide yyy');
    
  });
  
});

