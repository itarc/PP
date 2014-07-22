describe("TeacherSlideShow Current Slide", function() {

  it("should not change if server unavailable", function() {
    
    var slideShow = new SlideShow([]);
    
    expect(slideShow.position._currentIndex).toBe(0);

    slideShow._refreshPosition(); // Does not synchronise since the javascript does not come from the server  

    expect(slideShow.position._currentIndex).toBe(0);    

  });
  
});
