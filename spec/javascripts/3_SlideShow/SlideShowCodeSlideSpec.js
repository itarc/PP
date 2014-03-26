describe("SlideShow IDE", function() {  

  it("should be updated when first slide in fixture and on server and slideshow is initialized", function() {

    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='send_code'><div id='code_output'><div class='slide'/></div>")	  
    spyOn(CodeSlide.prototype, '_update');
    getResource = jasmine.createSpy('getResource').andReturn('0');    

    var slideShow = new SlideShow(queryAll(document, '.slide'))

    expect(CodeSlide.prototype._update.calls.length).toBe(1);     	  

  });

  it("should be updated when synchronised with server and server index different from current index", function() {
 
    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='send_code'><div id='code_output'><div class='slide'/></div>")        
    spyOn(CodeSlide.prototype, '_update');
    getResource = jasmine.createSpy('getResource').andReturn('11');
  
    var slideShow = new SlideShow(queryAll(document, '.slide'))
    slideShow._currentIndex = 0

    expect(CodeSlide.prototype._update.calls.length).toBe(1);    
    expect(slideShow._currentIndex).toBe(0);     
         
     slideShow.synchronise();
   
    expect(CodeSlide.prototype._update.calls.length).toBe(2);
 
   });

  it("should NOT be updated when synchronised with server when server index equals current index", function() {

    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='send_code'><div id='code_output'><div class='slide'/></div>")        
    spyOn(CodeSlide.prototype, '_update');
    getResource = jasmine.createSpy('getResource').andReturn('0');

    var slideShow = new SlideShow(queryAll(document, '.slide'))

    expect(CodeSlide.prototype._update.calls.length).toBe(1);    
    expect(slideShow._currentIndex).toBe(0);     
         
    slideShow.synchronise();

    expect(CodeSlide.prototype._update.calls.length).toBe(1);

  });

});
