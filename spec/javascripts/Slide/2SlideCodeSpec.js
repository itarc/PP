describe("Slide : Coding", function() {

  it("should call code execution", function() {
  
    slideNode = sandbox("<div class='slide'><section><textarea id='code_input'>puts 1</textarea><textarea id='code_output'></textarea></section></div>");
  
    postResource = jasmine.createSpy('postResource').andReturn('1');  
	  
    expect(slideNode.querySelector('#code_input').innerHTML).toBe('puts 1');
    expect(slideNode.querySelector('#code_output').innerHTML).toBe('');	  
	  
    var slide = new Slide(slideNode);
    slide.executeCode()
	  
    expect(postResource).toHaveBeenCalled();
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/code_execution_result', 'puts 1', SYNCHRONOUS);
	  
    expect(slideNode.querySelector('#code_input').innerHTML).toBe('puts 1');
    expect(slideNode.querySelector('#code_output').innerHTML).toBe('1');
    
  });
  
  it("should call code execution when click on execute", function() {
  
    slideNode = sandbox("<div class='slide'><section><textarea id='code_input'>puts 1</textarea><input type='button' id='execute'/><textarea id='code_output'></textarea></section></div>");
  
    spyOn(Slide.prototype, 'executeCode');
	  
    var slide = new Slide(slideNode);
    slideNode.querySelector('#execute').click();

    expect(Slide.prototype.executeCode).toHaveBeenCalled();
    
  });
  
  it("should call code execution when ALT-R pressed", function() {

    slideNode = sandbox("<div class='slide'/><section><textarea id='code_input'>puts 1</textarea><input type='button' id='execute'/><textarea id='code_output'></textarea></section><div>");
    spyOn(Slide.prototype, 'executeCode');
	  
    var slide = new Slide(slideNode);

    __triggerKeyboardEvent(slideNode.querySelector('#code_input'), R, ALT);
	  
    expect(Slide.prototype.executeCode).toHaveBeenCalled();

  });      
  
});

