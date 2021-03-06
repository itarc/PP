IDE_slide_html =  
HEADER + 
code_input + 
code_helpers +
author_bar +
buttons + 
code_ouput + 
FOOTER

describe("IDE UPDATE", function() {
	
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html); 
    slideshow = new SlideShow([])
    slide = new CodeSlide(slideNode, slideshow);
  });
  
  it("should show current code helper", function() {
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').and.returnValue("{}");    
    spyOn(CodeHelpers.prototype, 'update');	  

    slideshow._currentIndex = 1;		  
    slide._update();
	  
    expect(CodeHelpers.prototype.update.calls.count()).toBe(1);
	  
  });  
  
  it("should run the user last run", function() {
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').and.returnValue({"author": "", "code": "last execution", "code_to_add": ""});
    spyOn(StandardOutput.prototype, 'updateWith');

    expect(StandardOutput.prototype.updateWith.calls.count()).toBe(0);

    slide._update();

    expect(ServerExecutionContext.prototype.getContextOnServer).toHaveBeenCalledWith('/code_last_execution/0');
    expect(StandardOutput.prototype.updateWith.calls.count()).toBe(1);       
  });
  
  it("should NOT run the user last run when code has not changed", function() {

    slide._editor.updateWithText('last execution');
    slide._authorBar.updateAuthorNameWith('#');
    
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').and.returnValue({"author": "#", "code": "last execution", "code_to_add": ""});
	  
    spyOn(StandardOutput.prototype, 'updateWith');
	  
    slide._update();
	  
    expect(StandardOutput.prototype.updateWith.calls.count()).toBe(0);
	  
  });  
  
  it("should NOT run anything when no last run, no code to display and no code to add", function() {

    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').and.returnValue({"author": "", "code": "", "code_to_add": ""});    
    
    slide._editor.updateWithText("print 'code remaining from previous slide'");
    
    spyOn(Resource.prototype, 'post');    
    
    slide._update();
    
    expect(Resource.prototype.post.calls.count()).toBe(0); 
    
  });  

}); 

IDE_slide_with_code_to_display_html =  
HEADER + 
code_input + 
"<div class='code_helper'>"+
"<div class='code_to_display'>puts 'CODE TO DISPLAY'</div>"+
"</div>"+
author_bar +
buttons + 
code_ouput + 
FOOTER

describe("IDE UPDATE with CODE TO DISPLAY in Code Helper", function() {
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_with_code_to_display_html);
    slideshow = new SlideShow([])
    slide = new CodeSlide(slideNode, slideshow);  
    spyOn(StandardOutput.prototype, 'updateWith');    
  });  
	
  it("should display CODE TO DISPLAY when no execution context on server", function() {
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').and.returnValue({"author": "", "code": "", "code_to_add": ""});    
    expect(slide._editor.content()).toBe("");

    expect(StandardOutput.prototype.updateWith.calls.count()).toBe(0);    
    
    slide._update();

    expect(slide._editor.content()).toBe("puts 'CODE TO DISPLAY'");
    expect(StandardOutput.prototype.updateWith.calls.count()).toBe(1);
  });
  
  it("should run last execution when exists", function() {     
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').and.returnValue({"author": "", "code": "LAST EXECUTION", "code_to_add": ""});    
    expect(slide._editor.content()).toBe("");
    
    expect(StandardOutput.prototype.updateWith.calls.count()).toBe(0); 

    slide._update();

    expect(slide._editor.content()).toBe("LAST EXECUTION");
    expect(StandardOutput.prototype.updateWith.calls.count()).toBe(1);   
  });  

  it("should NOT run code that is already in editor", function() {
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').and.returnValue({"author": "", "code": "", "code_to_add": ""});        
    expect(slide._editor.content()).toBe("");
    
    slide._update();

    expect(slide._editor.content()).toBe("puts 'CODE TO DISPLAY'");
    expect(StandardOutput.prototype.updateWith.calls.count()).toBe(1); 	

    slide._update();

    expect(slide._editor.content()).toBe("puts 'CODE TO DISPLAY'");    
    expect(StandardOutput.prototype.updateWith.calls.count()).toBe(1); 	
  }); 

});

IDE_slide_with_code_to_add_html =  
HEADER + 
code_input + 
"<div class='code_helper'>"+
"<div class='code_to_add'>puts 'CODE TO ADD'</div>"+
"</div>"+
author_bar +
buttons + 
code_ouput + 
FOOTER
  
describe("IDE UPDATE with code to ADD in Code Helper", function() {  
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_with_code_to_add_html);
    slideshow = new SlideShow([])
    slide = new CodeSlide(slideNode, slideshow);
   });	  
  
  it("should run code to add", function() {
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').and.returnValue({"author": "", "code": ""});        
    spyOn(Resource.prototype, 'post').and.returnValue("CODE TO ADD");

    slide._update();
	  
    expect(slideNode.querySelector('#code_input').value).toBe("");	  
    expect(Resource.prototype.post).toHaveBeenCalledWith('/code_run_result', SEPARATOR + "puts 'CODE TO ADD'", SYNCHRONOUS);
    expect(slideNode.querySelector('#code_output').value).toBe("CODE TO ADD");  

  });	  
  
  it("should NOT run code that is already in editor", function() {
    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').and.returnValue({"author": "#", "code": "code to execute" + SEPARATOR + "puts 'CODE TO ADD'"});        
    spyOn(StandardOutput.prototype, 'updateWith'); 

    slide._editor.updateWithText('code to execute');	 
    slide._authorBar.updateAuthorNameWith('#');	 
    slide._update();

    expect(StandardOutput.prototype.updateWith.calls.count()).toBe(0);  

  });  
  
  // it("should run code if last execution exists and code to execute is empty", function() {
  //   spyOn(ServerExecutionContext.prototype, 'getContextOnServer').and.returnValue({"author": "#", "code": "" + SEPARATOR + "puts 'CODE TO ADD'"});        
  //   spyOn(CodeSlide.prototype, '_displayRunResult');

  //   slide._editor.updateWithText('');   
  //   slide._authorBar.updateAuthorNameWith('#');  
  //   slide._update();

  //   expect(CodeSlide.prototype._displayRunResult.calls.count()).toBe(1);    
  // });
  
  it("should NOT display code to add in code editor", function() {

    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').and.returnValue({"author": "", "code": "" + SEPARATOR + "puts 'CODE TO ADD'" });
    
    var slideshow = new SlideShow([])
    var slide = new CodeSlide(slideNode, slideshow);
	  
    expect(slideNode.querySelector('#code_input').value).toBe("");	  
	  
    slide._update();	  

    expect(slideNode.querySelector('#code_input').value).toBe("");

  });
  
  //~ it("should NOT display code to add in Teacher code editor when get attendee last Send", function() {

    //~ getResource = jasmine.createSpy('getResource').and.returnValue('attendee name'+ '' + SEPARATOR + ''+ 'attendee code' +SEPARATOR + "puts 'CODE TO ADD'");

    //~ var slide = new CodeSlide(slideNode);
	  
    //~ expect(slideNode.querySelector('#code_input').value).toBe("");
	  
    //~ slide._update();	  

    //~ expect(slideNode.querySelector('#code_input').value).toBe("attendee code");

  //~ });
  
  it("should get last teacher run without code to add", function() {

    spyOn(ServerExecutionContext.prototype, 'getContextOnServer').and.returnValue({"author": '', "code": 'teacher run', "code_to_add": "puts 'CODE TO ADD'" });    
	  
    expect(slideNode.querySelector('#code_input').value).toBe("");	  
    
    slideNode.querySelector('#get_code').click();    

    expect(slideNode.querySelector('#code_input').value).toBe("teacher run");

  });  

});
