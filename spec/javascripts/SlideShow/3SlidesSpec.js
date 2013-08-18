describe("SlideShow with 3 Slides", function() {

  it("should open on first slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'><div class='slide'></div></div>")
    var slideShow = new SlideShow(queryAll('.slide'))
	  
    expect(slideShow._slides.length).toBe(3);	  

    expect(slideShow._slides[0]._node.className).toBe('slide current')
    expect(slideShow._slides[1]._node.className).toBe('slide next')	  
    expect(slideShow._slides[2]._node.className).toBe('slide')	  
	  
  })
  
  it("should go to second slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'><div class='slide'></div></div>")
    var slideShow = new SlideShow(queryAll('.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
	  
    expect(slideShow._slides[0]._node.className).toBe('slide previous')
    expect(slideShow._slides[1]._node.className).toBe('slide current')
    expect(slideShow._slides[2]._node.className).toBe('slide next')	  

  }); 

  it("should go to third slide", function() {

    setFixtures("<div class='slides'><div class='slide'><div class='slide'><div class='slide'></div></div>")
    var slideShow = new SlideShow(queryAll('.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, RIGHT_ARROW)
	  
    expect(slideShow._slides[0]._node.className).toBe('slide')
    expect(slideShow._slides[1]._node.className).toBe('slide previous')
    expect(slideShow._slides[2]._node.className).toBe('slide current')	  
    
  });   

  it("should go back to second slide", function() {

    setFixtures("<div class='slides'><div class='slide'><div class='slide'><div class='slide'></div></div>")
    var slideShow = new SlideShow(queryAll('.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, LEFT_ARROW)
	  
    expect(slideShow._slides[0]._node.className).toBe('slide previous')
    expect(slideShow._slides[1]._node.className).toBe('slide current')
    expect(slideShow._slides[2]._node.className).toBe('slide next')		  
    
  }); 
  
  it("should go back to first slide", function() {

    setFixtures("<div class='slides'><div class='slide'><div class='slide'><div class='slide'></div></div>")
    var slideShow = new SlideShow(queryAll('.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, LEFT_ARROW)
    __triggerKeyboardEvent(document, LEFT_ARROW)
	  
    expect(slideShow._slides[0]._node.className).toBe('slide current')
    expect(slideShow._slides[1]._node.className).toBe('slide next')
    expect(slideShow._slides[2]._node.className).toBe('slide')	  
    
  })
  
})
