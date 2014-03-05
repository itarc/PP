describe("SlideShow Code Slide", function() {  

  it("should be updated when first slide and slideshow is initialized", function() {

    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='send_code'><div id='code_output'><div class='slide'/></div>")	  
    spyOn(CodeSlide.prototype, '_update');

    var slideShow = new SlideShow(queryAll('.slide'))

    expect(CodeSlide.prototype._update.calls.length).toBe(1);     	  

  });

  it("should be updated when synchronised with server and server index different from current index", function() {
 
    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='send_code'><div id='code_output'><div class='slide'/></div>")        
    spyOn(CodeSlide.prototype, '_update');
    getResource = jasmine.createSpy('getResource').andReturn('11');
  
    var slideShow = new SlideShow(queryAll('.slide'))
    slideShow._currentIndex = 0

    expect(CodeSlide.prototype._update.calls.length).toBe(1);    
    expect(slideShow._currentIndex).toBe(0);     
         
     slideShow.synchronise();
   
    expect(CodeSlide.prototype._update.calls.length).toBe(2);
 
   });

  it("should NOT be updated when synchronised with server and server index equals current index", function() {

    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='send_code'><div id='code_output'><div class='slide'/></div>")        
    spyOn(CodeSlide.prototype, '_update');
    getResource = jasmine.createSpy('getResource').andReturn('0');

    var slideShow = new SlideShow(queryAll('.slide'))

    expect(CodeSlide.prototype._update.calls.length).toBe(1);    
    expect(slideShow._currentIndex).toBe(0);     
         
    slideShow.synchronise();

    expect(CodeSlide.prototype._update.calls.length).toBe(1);

  });

});
