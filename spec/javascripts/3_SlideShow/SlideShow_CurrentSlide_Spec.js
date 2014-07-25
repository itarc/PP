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
  
  it("should be position on server when refreshed", function() { 
    var slideShow = new SlideShow(queryAll(document, '.slide'));

    expect(slideShow.position._currentIndex).toBe(0);
    expect(slideShow.position._IDEDisplayed).toBe(false);
    
    spyOn(Position.prototype, "getPosition").andReturn('212;true');     
    slideShow._refresh();
    
    expect(slideShow.position._currentIndex).toBe(212);
    expect(slideShow.position._IDEDisplayed).toBe(true);
  });
  
}); 

describe("TeacherSlideShow Current Slide Index", function() {
  
  beforeEach(function () {
    setFixtures(SLIDESHOW_WITH_3_SLIDES);
  });

  it("should be SERVER index when initialized", function() {
    spyOn(Position.prototype, 'getPosition').andReturn("1;false");
    slideShow = new SlideShow(queryAll(document, '.slide')); 
    
    expect(slideShow._currentIndex).toBe(1);
    expect(slideShow._IDEDisplayed).toBe(false);
  });  
  
  it("should be SERVER index when refreshed", function() {
    slideShow = new SlideShow(queryAll(document, '.slide'));     
    spyOn(Position.prototype, 'getPosition').andReturn("2;true");
    
    slideShow._refresh();
    expect(slideShow._currentIndex).toBe(2);
    expect(slideShow._IDEDisplayed).toBe(true);
  });   
	
});

describe("SlideShow Current Slide", function() {
  
  beforeEach(function () {
    setFixtures(SLIDESHOW_WITH_3_SLIDES)	 
  });

  it("should be visible when slideshow initialized", function() {
    var slideShow = new SlideShow(queryAll(document, '.slide'))

    expect(slideShow._slides[slideShow._currentIndex]._node.className).toBe('slide current');
  });
  
  it("should be updated when slideshow initialized", function() {
    spyOn(SlideShow.prototype, "_update");
    spyOn(Position.prototype, 'getPosition').andReturn('3;true');    
    var slideShow = new SlideShow(queryAll(document, '.slide'))

    expect(slideShow._currentIndex).toBe(3);
    expect(slideShow._IDEDisplayed).toBe(true);
    expect(SlideShow.prototype._update.calls.length).toBe(1);
  });  
  
  it("should NOT be updated when position did not change", function() {
    spyOn(SlideShow.prototype, '_update');
    spyOn(Position.prototype, 'getPosition').andReturn('3;true');  
    var slideShow = new SlideShow(queryAll(document, '.slide'))
    
    expect(SlideShow.prototype._update.calls.length).toBe(1);
   
    slideShow._refresh();

    expect(SlideShow.prototype._update.calls.length).toBe(1);
    
    slideShow._refresh();
    
    expect(SlideShow.prototype._update.calls.length).toBe(1);
  });    

}); 
  
