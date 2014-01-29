describe("SlideShow slide index management :", function() {

  it("should init with currentIndex to zero", function() {

    var slideShow = new SlideShow([]);

    expect(slideShow._currentIndex).toBe(0)

  });  
	
  it("should increase currentIndex", function() {

    var slideShow = new SlideShow([]);
	  
    slideShow._currentIndex = 1;
    slideShow._numberOfSlides = 3;	  

    slideShow.next();

    expect(slideShow._currentIndex).toBe(2)

  });
  
  it("should decrease currentIndex", function() {

    var slideShow = new SlideShow([]);
	  
    slideShow._currentIndex = 2;
    slideShow._numberOfSlides = 3;	  

    slideShow.prev()

    expect(slideShow._currentIndex).toBe(1)

  });

  it("should not go beyond last slide", function() {

    var slideShow = new SlideShow([]);
	  
    slideShow._currentIndex = 2;
    slideShow._numberOfSlides = 3;

    slideShow.next()

    expect(slideShow._currentIndex).toBe(2)

  });
  
  it("should not go under first slide", function() {

    var slideShow = new SlideShow([]);
	  
    slideShow._currentIndex = 0;
    slideShow._numberOfSlides = 3;

    slideShow.prev()

    expect(slideShow._currentIndex).toBe(0)

  });
  
});