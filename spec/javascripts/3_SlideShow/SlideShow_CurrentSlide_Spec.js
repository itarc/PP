SLIDESHOW_WITH_3_SLIDES = 
"<div class='slides'>"+
  "<div class='slide'/>"+
  "<div class='slide'/>"+
  "<div class='slide'/>"+
"</div>"

describe("SlideShow Position", function() {
  
  beforeEach(function () {
    setFixtures(SLIDESHOW_WITH_3_SLIDES)	 
  });
  
  it("should be position on server when slideshow is initialized", function() {
    spyOn(Position.prototype, "getPosition").andReturn('121;true');
    var slideShow = new SlideShow(queryAll(document, '.slide'));
    
    expect(slideShow.position._currentIndex).toBe(121);
    expect(slideShow.position._IDEDisplayed).toBe(true);
  });  
  
  it("should be position on server when position is refreshed", function() { 
    var slideShow = new SlideShow(queryAll(document, '.slide'));
    
    expect(slideShow.position._currentIndex).toBe(0);
    expect(slideShow.position._IDEDisplayed).toBe(false);
    
    spyOn(Position.prototype, "getPosition").andReturn('212;true');     
    slideShow._refreshPosition();
    
    expect(slideShow.position._currentIndex).toBe(212);
    expect(slideShow.position._IDEDisplayed).toBe(true);
  });
  
}); 

describe("SlideShow Current Slide", function() {
  
  beforeEach(function () {
    setFixtures(SLIDESHOW_WITH_3_SLIDES)	 
  });

  it("should be visible when slideshow initialized", function() {
    var slideShow = new SlideShow(queryAll(document, '.slide'))

    expect(slideShow._slides[slideShow.position._currentIndex]._node.className).toBe('slide current');
  });
  
  it("should be update when slideshow initialized", function() {
    spyOn(SlideShow.prototype, "_updateCurrentSlide").andReturn('121;true');
    var slideShow = new SlideShow(queryAll(document, '.slide'))

    expect(SlideShow.prototype._updateCurrentSlide.calls.length).toBe(1);
  });  

}); 
  
