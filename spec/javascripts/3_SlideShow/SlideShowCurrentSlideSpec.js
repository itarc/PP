describe("SlideShow Current Slide", function() {

  it("should current server slide when slideshow is initialized", function() {
	  
    spyOn(SlideShow.prototype, '_getCurrentIndexOnServer');

    var slideShow = new SlideShow([]);

    expect(SlideShow.prototype._getCurrentIndexOnServer.calls.length).toBe(1); 

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
  
  it("should be visible when slideshow initialized", function() {
	  
    setFixtures("<div class='slides'><div class='slide'/><div class='slide'/></div>")
    var slideShow = new SlideShow(queryAll(document, '.slide'))

    expect(slideShow._slides[0]._node.className).toBe('slide current');

  });		

  it("should not change if new index is unknown", function() {
	  
    setFixtures("<div class='slides'><div class='slide'/><div class='slide'/></div>")
    var slideShow = new SlideShow(queryAll(document, '.slide'))

    expect(slideShow._slides[0]._node.className).toBe('slide current');
	  
    slideShow._currentIndex = 'UNKNOWN';
    slideShow._show_current_slide();
	  
    expect(slideShow._slides[0]._node.className).toBe('slide current');

  });	  
  
});