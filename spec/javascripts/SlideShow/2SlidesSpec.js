describe("SlideShow with 2 Slides", function() {

  it("should open on first slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'></div></div>")
    var slideShow = new SlideShow(queryAll('.slide'))

    expect(slideShow._slides.length).toBe(2);	  
    expect(slideShow._slides[0] instanceof Slide).toBe(true)
    expect(slideShow._slides[1] instanceof Slide).toBe(true)

    expect(slideShow._currentIndex).toBe(0)	  

    expect(slideShow._slides[0]._node.className).toBe('slide current')
    expect(slideShow._slides[1]._node.className).toBe('slide next')

  });  
  
  it("should go to next slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'></div></div>")
    var slideShow = new SlideShow(queryAll('.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
	  
    expect(slideShow._currentIndex).toBe(1)	  
	  
    expect(slideShow._slides[0]._node.className).toBe('slide previous')
    expect(slideShow._slides[1]._node.className).toBe('slide current')

  });    
  
  it("should go to previous slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'></div></div>")
    var slideShow = new SlideShow(queryAll('.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, LEFT_ARROW)
	  
    expect(slideShow._currentIndex).toBe(0)	  
	  
    expect(slideShow._slides[0]._node.className).toBe('slide current')
    expect(slideShow._slides[1]._node.className).toBe('slide next')

  });   

})
