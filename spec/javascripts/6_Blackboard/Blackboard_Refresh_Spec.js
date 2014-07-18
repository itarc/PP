IDE_slide_html = "" +
"<div class='slide'/><section>"+
  "<textarea id='code_input'></textarea>" +
  "<textarea id='code_output'></textarea>"+  
  "<div class='code_helper' id='code_helper_1'></div>"+
  "<div class='code_helper' id='code_helper_2'></div>" +
  "<div class='code_author'><span id='author_name'>author</span></div>" +
  "<input type='button' id='execute'>"+
  "<input type='button' id='send_code'/>"+
  "<input type='button' id='get_code'/>" +
  "<input type='button' id='get_last_send'/>"+
"</section><div>"

describe("Blackboard RUN", function() {
  
  beforeEach(function () {
    setFixtures("<div class='slides'>"+ IDE_slide_html +"</div>")	      
    blackboardSlideShow = new BlackboardSlideShow(queryAll(document, '.slide')); 
  });
  
  it("should call specific url", function() {

    postResource = jasmine.createSpy('postResource');

    blackboardSlideShow._slides[0]._editor.updateWithText("code to run");
    blackboardSlideShow._slides[0].executeCode();

    expect(postResource).toHaveBeenCalledWith('/code_run_result_blackboard/0', "code to run", SYNCHRONOUS);

  });
  
});  

describe("Blackboard REFRESH", function() {
  
  beforeEach(function () {
    setFixtures("<div class='slides'>"+ IDE_slide_html +"</div>")	      
    blackboardSlideShow = new BlackboardSlideShow(queryAll(document, '.slide')); 
    spyOn(BlackboardCodeSlide.prototype, 'executeCodeAt');   
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').andReturn({ "author": '0', "code": 'last send to blackboard',"code_to_add": '' });      
  });
  
  it("should get last Teacher run when refreshed", function() {
  
    blackboardSlideShow._refresh();

    expect(getResource).toHaveBeenCalledWith('/code_get_last_send_to_blackboard/0');    
    expect(blackboardSlideShow._slides[0]._editor.content()).toBe('last send to blackboard');
    expect(BlackboardCodeSlide.prototype.executeCodeAt).toHaveBeenCalledWith('/code_run_result_blackboard');

  });  
  
  it("should NOT refresh when last send is the same that code in editor", function() {
    
    blackboardSlideShow._slides[0]._editor.updateWithText("last send to blackboard");
    
    blackboardSlideShow._refresh();
    
    expect(BlackboardCodeSlide.prototype.executeCodeAt.calls.length).toBe(0);
    
  });
  
  it("should NOT show current slide if no change", function() {

    spyOn(BlackboardSlideShow.prototype, '_showCurrentSlide');
    
    getResource = jasmine.createSpy('getResource').andReturn('1;false');
    
    blackboardSlideShow._refresh();
    
    expect(BlackboardSlideShow.prototype._showCurrentSlide.calls.length).toBe(1);
    
    blackboardSlideShow._refresh();
    
    expect(BlackboardSlideShow.prototype._showCurrentSlide.calls.length).toBe(1);
    
  });  
  
  it("should refresh position every second", function() {
	  
    spyOn(BlackboardSlideShow.prototype, '_refresh');
    jasmine.Clock.useMock();

    setInterval( function(){ blackboardSlideShow._refresh(); },1000); // Mandatory even if it is already done in the javascript

    expect(BlackboardSlideShow.prototype._refresh.callCount).toEqual(0);
    jasmine.Clock.tick(1001);
    expect(BlackboardSlideShow.prototype._refresh.callCount).toEqual(1);
    
    expect(slideshowTimer).toBeDefined(); // Test if timer is javascript

  });  

});
