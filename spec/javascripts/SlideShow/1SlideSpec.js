describe("SlideShow with 1 Slide", function() {

  it("should have one current slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'></div></div>");
    var slideShow = new SlideShow(queryAll('.slide'));

    expect(slideShow._slides.length).toBe(1);	  
    expect(slideShow._slides[0] instanceof Slide).toBe(true);

    expect(slideShow._slides[0]._node.className).toBe('slide current');
    expect(slideShow._currentIndex).toBe(0);

  });
  
});
