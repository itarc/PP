describe("SlideShow with an IDE Slide", function() {  
  
  beforeEach(function() {

    setFixtures("<div class='slides'><div class='slide'><div id='code_input'><div id='execute'><div id='send_code'/><div id='get_code'/><div id='code_output'><div class='slide'/></div>")	  
    spyOn(CodeSlide.prototype, '_update');    
    
  });  

  //~ it("should be updated when first slide", function() {

    //~ getResource = jasmine.createSpy('getResource').andReturn('0');    

    //~ var slideShow = new SlideShow(queryAll(document, '.slide'))

    //~ expect(CodeSlide.prototype._update.calls.length).toBe(1);     	  

  //~ });

  it("should be updated when refreshed", function() {
 
    var slideShow = new SlideShow(queryAll(document, '.slide'))

    //~ expect(CodeSlide.prototype._update.calls.length).toBe(1);    
    expect(slideShow.position._currentIndex).toBe(0);     
         
    getResource = jasmine.createSpy('getResource').andReturn('11');
    
    slideShow._refresh();
   
    //~ expect(CodeSlide.prototype._update.calls.length).toBe(2);
    expect(CodeSlide.prototype._update.calls.length).toBe(1);
 
   });

  it("should NOT be updated when refreshed but nothing changed", function() {

    getResource = jasmine.createSpy('getResource').andReturn('0;false');

    var slideShow = new SlideShow(queryAll(document, '.slide'))     

    expect(CodeSlide.prototype._update.calls.length).toBe(0);    
    expect(slideShow.position._currentIndex).toBe(0);
    
    slideShow._refresh();

    expect(CodeSlide.prototype._update.calls.length).toBe(0);

  });

});
