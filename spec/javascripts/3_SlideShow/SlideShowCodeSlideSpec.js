describe("SlideShow Code Slide", function() {  

  it("should be updated when first slide and slideshow is initialized", function() {

    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='code_output'><div class='slide'/></div>")	  
    spyOn(CodeSlide.prototype, '_update');

    var slideShow = new SlideShow(queryAll('.slide'))

    expect(CodeSlide.prototype._update.calls.length).toBe(1);     	  

  });  
  
  it("should be updated when synchronised with server", function() {

    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='code_output'><div class='slide'/></div>")	  
    spyOn(CodeSlide.prototype, '_update');

    var slideShow = new SlideShow(queryAll('.slide'))	  
    slideShow.synchronise();

    expect(CodeSlide.prototype._update.calls.length).toBe(2);  // initialized and synchronised   

  });

});
