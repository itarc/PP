IDE_slide_html =  
HEADER + 
code_input + 
code_helpers +
author_bar +
buttons + 
code_ouput + 
FOOTER

describe("IDE STANDARD OUTPUT", function() {
  
  beforeEach(function () {
    slideNode = sandbox(IDE_slide_html);
    IDESlide = new CodeSlide(slideNode);  
  });	
  
  it("should be empty when IDE initialized", function() {
   expect(slideNode.querySelector('#code_output').value).toBe('');
  });  
  
  it("should be filled when updated", function() {
   IDESlide._standardOutput.updateWith("CODE RESULT");
	  
   expect(slideNode.querySelector('#code_output').value).toBe("CODE RESULT");
  });   
  
});
