describe("SlideShow current slide :", function() {

  it("should be first slide when slideshow is initialized", function() {

    var slideShow = new SlideShow([]);

    expect(slideShow._currentIndex).toBe(0)

  });  
	
  it("should be next slide when next slide is called", function() {

    var slideShow = new SlideShow([]);
	  
    slideShow._currentIndex = 1;
    slideShow._numberOfSlides = 3;	  

    slideShow.next();

    expect(slideShow._currentIndex).toBe(2)

  });
  
  it("should be previous slide when previous slide is called", function() {

    var slideShow = new SlideShow([]);
	  
    slideShow._currentIndex = 2;
    slideShow._numberOfSlides = 3;	  

    slideShow.prev()

    expect(slideShow._currentIndex).toBe(1)

  });

  it("should NOT be a slide beyond last slide", function() {

    var slideShow = new SlideShow([]);
	  
    slideShow._currentIndex = 2;
    slideShow._numberOfSlides = 3;

    slideShow.next()

    expect(slideShow._currentIndex).toBe(2)

  });
  
  it("should NOT be a slide under first slide", function() {

    var slideShow = new SlideShow([]);
	  
    slideShow._currentIndex = 0;
    slideShow._numberOfSlides = 3;

    slideShow.prev()

    expect(slideShow._currentIndex).toBe(0)

  });
  
});