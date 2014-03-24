describe("Code Helper (Mini-slide)", function() {

  it("should change state", function() {

    CodeHelperNode = sandbox("<div class='code_helper'><div class='code_to_display'><<<>>>&&&'''\"\"\"</div></div>");
    var codeHelper = new CodeHelper(CodeHelperNode);
    
    expect(CodeHelperNode.className).toBe('code_helper'); 
    
    codeHelper.setState('current')
    
    expect(CodeHelperNode.className).toBe('code_helper current'); 

  }); 
  
  it("should escape html caracters in code to display", function() { 

    CodeHelperNode = sandbox("<div class='code_helper'><div class='code_to_display'><<<>>>&&&'''\"\"\"</div></div>");
    var codeHelper = new CodeHelper(CodeHelperNode);
	  
    expect(codeHelper.codeToDisplay()).toBe("<<<>>>&&&'''\"\"\"");
	  
  });    
  
  it("should esacape html caracters in code to add", function() { 

    CodeHelperNode = sandbox("<div class='code_helper'><div class='code_to_add'><<<>>>&&&'''\"\"\"</div></div>");
    var codeHelper = new CodeHelper(CodeHelperNode);
	  
    expect(codeHelper.codeToAdd()).toBe(SEPARATOR + "<<<>>>&&&'''\"\"\"");
	  
  });  
  
});