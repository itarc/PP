describe("SlideShow Current Slide", function() {
  
  beforeEach(function () {
    setFixtures("<div class='slides'><div class='slide'/><div class='slide'/><div class='slide'/></div>")	 
  });
  
  it("should be current position when position is refreshed", function() {
    getResource = jasmine.createSpy('getResource').andReturn('0;false');
    
    var slideShow = new SlideShow(queryAll(document, '.slide'));
    getResource = jasmine.createSpy('getResource').andReturn('212;true');
    slideShow._refreshPosition();
    
    expect(slideShow.position._currentIndex).toBe(212);
    expect(slideShow.position._IDEDisplayed).toBe(true);
  });  

  it("should be current position when slideshow is initialized", function() {
    getResource = jasmine.createSpy('getResource').andReturn('121;true');
    
    var slideShow = new SlideShow(queryAll(document, '.slide'));
    
    expect(slideShow.position._currentIndex).toBe(121);
    expect(slideShow.position._IDEDisplayed).toBe(true);
  });

  it("should be visible when slideshow initialized", function() {
    getResource = jasmine.createSpy('getResource').andReturn('0;false');
    
    var slideShow = new SlideShow(queryAll(document, '.slide'))

    expect(slideShow._slides[slideShow.position._currentIndex]._node.className).toBe('slide current');
  });  
  
});  
  
describe("SlideShow Current Slide Index", function() {
  
  beforeEach(function () {
    setFixtures("<div class='slides'><div class='slide'/><div class='slide'/><div class='slide'/></div>")	 
    slideShow = new SlideShow(queryAll(document, '.slide'));
  });

  it("should be SERVER index when initialized", function() {
    expect(slideShow.position._currentIndex).toBe(0)
  });  
	
  it("should be NEXT index when next slide is called", function() {
    slideShow.position._currentIndex = 1;
    slideShow._numberOfSlides = 3;	  

    slideShow.next();

    expect(slideShow.position._currentIndex).toBe(2)
  });
  
  it("should be PREVIOUS index when previous slide is called", function() {	  
    slideShow.position._currentIndex = 2;
    slideShow._numberOfSlides = 3;	  

    slideShow.prev()

    expect(slideShow.position._currentIndex).toBe(1)
  });

  it("should NOT be a slide beyond last slide", function() {
    slideShow.position._currentIndex = 2;
    slideShow._numberOfSlides = 3;

    slideShow.next()

    expect(slideShow.position._currentIndex).toBe(2)
  });
  
  it("should NOT be a slide under first slide", function() {
    slideShow.position._currentIndex = 0;
    slideShow._numberOfSlides = 3;

    slideShow.prev()

    expect(slideShow.position._currentIndex).toBe(0)
  });
  
});