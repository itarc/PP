describe("Code Slide", function() {

  it("should call code execution", function() {
  
    codeSlideNode = sandbox("<div class='slide'><section><textarea id='code_input'>puts 1</textarea><input type='button' id='execute'/><textarea id='code_output'></textarea></section></div>");
  
    postResource = jasmine.createSpy('postResource').andReturn('1');  
	  
    expect(codeSlideNode.querySelector('#code_input').value).toBe('puts 1');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('');	  
	  
    var slide = new CodeSlide(codeSlideNode);
    slide.executeCode()
	  
    expect(postResource).toHaveBeenCalled();
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/code_run_result', 'puts 1', SYNCHRONOUS);
	  
    expect(codeSlideNode.querySelector('#code_input').value).toBe('puts 1');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('1');
    
  });
  
  it("should call code execution when click on execute", function() {
  
    codeSlideNode = sandbox("<div class='slide'><section><textarea id='code_input'>puts 1</textarea><input type='button' id='execute'/><textarea id='code_output'></textarea></section></div>");
  
    spyOn(CodeSlide.prototype, 'executeCode');
	  
    var slide = new CodeSlide(codeSlideNode);
    codeSlideNode.querySelector('#execute').click();

    expect(CodeSlide.prototype.executeCode).toHaveBeenCalled();
    
  });
  
  it("should call code execution when ALT-R pressed", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'>puts 1</textarea><input type='button' id='execute'/><textarea id='code_output'></textarea></section><div>");
    spyOn(CodeSlide.prototype, 'executeCode');
	  
    var slide = new CodeSlide(codeSlideNode);

    __triggerKeyboardEvent(codeSlideNode.querySelector('#code_input'), R, ALT);
	  
    expect(CodeSlide.prototype.executeCode).toHaveBeenCalled();

  });

  it("should update current code_helper", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><textarea class='code_helper' id='code_helper_1'></textarea><textarea class='code_helper' id='code_helper_2'></textarea><input type='button' id='execute'><textarea id='code_output'></textarea></section><div>");

    var slide = new CodeSlide(codeSlideNode);

    slide.showCurrentCodeHelper(0);
	  
    expect(codeSlideNode.querySelector('#code_helper_1').className).toBe('code_helper current');
    expect(codeSlideNode.querySelector('#code_helper_2').className).toBe('code_helper');
	  
    slide.showCurrentCodeHelper(1);	

    expect(codeSlideNode.querySelector('#code_helper_1').className).toBe('code_helper');
    expect(codeSlideNode.querySelector('#code_helper_2').className).toBe('code_helper current');  

  });  
  
  it("should NOT update current code_helper if no code helper", function() {

    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><input type='button' id='execute'><textarea id='code_output'></textarea></section><div>");

    var slide = new CodeSlide(codeSlideNode);

    slide.showCurrentCodeHelper(0);

  });  

 it("should update code editor and standard output with last run", function() {
  
    codeSlideNode = sandbox("<div class='slide'/><section><textarea id='code_input'></textarea><input type='button' id='execute'/><textarea id='code_output'></textarea></section><div>");
 
    expect(codeSlideNode.querySelector('#code_input').value).toBe('');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('');
	  
    getResource = jasmine.createSpy('getResource').andReturn('puts 2');
    postResource = jasmine.createSpy('postResource').andReturn('2');	  
	  
    var slide = new CodeSlide(codeSlideNode);

    slide.updateEditorAndExecuteCode();
	  
    expect(postResource).toHaveBeenCalled();	  
	  
    expect(getResource).toHaveBeenCalled();
    expect(getResource.calls.length).toBe(1);
    expect(getResource).toHaveBeenCalledWith('/code_last_run');

    expect(codeSlideNode.querySelector('#code_input').value).toBe('puts 2');
    expect(codeSlideNode.querySelector('#code_output').value).toBe('2');
    
  });  
  
});

