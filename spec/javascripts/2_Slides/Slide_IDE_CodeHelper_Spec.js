describe("Code Helper (Mini-slide)", function() {

  it("should change state", function() {

    CodeHelperNode = sandbox("<div class='code_helper'><div class='code_to_display'><<<>>>&&&'''\"\"\"</div></div>");
    var codeHelper = new CodeHelper(CodeHelperNode);
    
    expect(CodeHelperNode.className).toBe('code_helper'); 
    
    codeHelper.setState('current')
    
    expect(CodeHelperNode.className).toBe('code_helper current'); 

  }); 
  
  it("should get code to display", function() { 

    CodeHelperNode = sandbox("<div class='code_helper'><div class='code_to_display'>CODE TO DISPLAY</div></div>");
    var codeHelper = new CodeHelper(CodeHelperNode);
	  
    expect(codeHelper.codeToDisplay()).toBe("CODE TO DISPLAY");
	  
  });  

  it("should get code to add", function() { 

    CodeHelperNode = sandbox("<div class='code_helper'><div class='code_to_display'>CODE TO ADD</div></div>");
    var codeHelper = new CodeHelper(CodeHelperNode);
	  
    expect(codeHelper.codeToDisplay()).toBe("CODE TO ADD");
	  
  });  
  
  it("should escape html caracters in code to display", function() { 

    CodeHelperNode = sandbox("<div class='code_helper'><div class='code_to_display'><<<>>>&&&'''\"\"\"</div></div>");
    var codeHelper = new CodeHelper(CodeHelperNode);
	  
    expect(codeHelper.codeToDisplay()).toBe("<<<>>>&&&'''\"\"\"");
	  
  });    
  
  it("should escape html caracters in code to add", function() { 

    CodeHelperNode = sandbox("<div class='code_helper'><div class='code_to_add'><<<>>>&&&'''\"\"\"</div></div>");
    var codeHelper = new CodeHelper(CodeHelperNode);
	  
    expect(codeHelper.codeToAdd()).toBe(SEPARATOR + "<<<>>>&&&'''\"\"\"");
	  
  });  
  
});

describe("IDE CODE HELPERS", function() {

  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);
    slideshow = new SlideShow([])  
    IDESlide = new CodeSlide(slideNode, slideshow);  
  });

  it("should show the right code helper", function() {
    expect(slideNode.querySelector('#code_helper_1').className).toBe('code_helper');
    expect(slideNode.querySelector('#code_helper_2').className).toBe('code_helper');   

    slideshow._currentIndex = 0;    
    IDESlide.showCodeHelper(0);

    expect(slideNode.querySelector('#code_helper_1').className).toBe('code_helper current');
    expect(slideNode.querySelector('#code_helper_2').className).toBe('code_helper');

    slideshow._currentIndex = 1;	  
    IDESlide.showCodeHelper(1);	

    expect(slideNode.querySelector('#code_helper_1').className).toBe('code_helper');
    expect(slideNode.querySelector('#code_helper_2').className).toBe('code_helper current');  
  });
  
});