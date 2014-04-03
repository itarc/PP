describe("SlideShow Current Slide", function() {

  it("should be current server slide when slideshow is initialized", function() {
    
    getResource = jasmine.createSpy('getResource').andReturn('121;true');

    var slideShow = new SlideShow([]);
    
    expect(slideShow._currentIndex).toBe(121);
    expect(slideShow._showIDE).toBe(true);

  });
  
  it("should be current server slide when slideshow is synchronized", function() {
    
    getResource = jasmine.createSpy('getResource').andReturn('0;false');

    var slideShow = new SlideShow([]);
    
    expect(slideShow._currentIndex).toBe(0);
    expect(slideShow._showIDE).toBe(false);    
    
    getResource = jasmine.createSpy('getResource').andReturn('212;true');
    
    slideShow.synchronise();
    
    expect(slideShow._currentIndex).toBe(212);
    expect(slideShow._showIDE).toBe(true);

  });  
  
  it("should change even if only showIDE state change", function() {
    
    getResource = jasmine.createSpy('getResource').andReturn('0;false');
    
    spyOn(SlideShow.prototype, '_refresh');

    var slideShow = new SlideShow([]);
    
    expect(SlideShow.prototype._refresh.calls.length).toBe(1);    
    
    getResource = jasmine.createSpy('getResource').andReturn('0;true');
    
    slideShow.synchronise();
    
    expect(SlideShow.prototype._refresh.calls.length).toBe(2);

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
    
    getResource = jasmine.createSpy('getResource').andReturn('0;false');
    
    var slideShow = new SlideShow(queryAll(document, '.slide'))

    expect(slideShow._slides[slideShow._currentIndex]._node.className).toBe('slide current');

  }); 
  
});