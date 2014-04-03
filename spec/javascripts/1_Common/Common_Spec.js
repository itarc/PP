describe("Common slide list", function() {

  it("should create a list of one slide", function() {
	  
    setFixtures("<div class='slide'></div>")

    var slideList = queryAll(document, '.slide')
	  
    expect(Object.prototype.toString.apply(slideList)).toBe('[object Array]')
    expect(slideList.length).toBe(1)
    expect(Object.prototype.toString.apply(slideList[0])).toBe('[object HTMLDivElement]')
    expect(slideList[0].tagName).toBe('DIV')
    expect(slideList[0]).toHaveClass('slide')
	  
  })

  it("should create a list of two slides", function() {
	  
    setFixtures("<div class='slide'></div><div class='slide'></div>")
	  
    var slideList = queryAll(document, '.slide')

    expect(Object.prototype.toString.apply(slideList)).toBe('[object Array]')
    expect(slideList.length).toBe(2)
    expect(Object.prototype.toString.apply(slideList[0])).toBe('[object HTMLDivElement]')
    expect(slideList[0].tagName).toBe('DIV')
    expect(slideList[0]).toHaveClass('slide')
    expect(Object.prototype.toString.apply(slideList[1])).toBe('[object HTMLDivElement]')
    expect(slideList[1].tagName).toBe('DIV')
    expect(slideList[1]).toHaveClass('slide')

  });

});  

describe("Common key handling", function() {
	
  it("should simulate keydown", function() {

    setFixtures("<div id='pressedKeyCode'></div>");

    expect(document.getElementById('pressedKeyCode').innerHTML).toBe("");
	  
    pressedKeyCodeElement = document.getElementById('pressedKeyCode');
    var updatePressedKeyCode = function(e) { document.getElementById('pressedKeyCode').innerHTML = e.keyCode; };
    pressedKeyCodeElement.addEventListener('keydown', updatePressedKeyCode, false);
    
    __triggerKeyboardEvent(document.getElementById('pressedKeyCode'), 39);
    
    expect(document.getElementById('pressedKeyCode').innerHTML).toBe("39");
    
  });
  
});

describe("Common post and get", function() {
  
  it("should post ASynchronous", function() {

    spyOn(XMLHttpRequest.prototype, 'open').andCallThrough()
    spyOn(XMLHttpRequest.prototype, 'send')

    postResponse = postResource('/teacher_current_slide', "1", ASYNCHRONOUS)

    expect(XMLHttpRequest.prototype.open).toHaveBeenCalled()
    expect(XMLHttpRequest.prototype.open.calls.length).toBe(1)
    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('POST', '/teacher_current_slide', ASYNCHRONOUS)
    expect(XMLHttpRequest.prototype.send).toHaveBeenCalled()
    expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith("1")
    expect(XMLHttpRequest.prototype.send.calls.length).toBe(1)	  
    expect(postResponse).not.toBeUndefined()

  });
  
  it("should get and post Synchronous", function() {

    spyOn(XMLHttpRequest.prototype, 'open').andCallThrough()
    spyOn(XMLHttpRequest.prototype, 'send')	  
	  
    getResponse = getResource('/teacher_current_slide')

    expect(XMLHttpRequest.prototype.open).toHaveBeenCalled()
    expect(XMLHttpRequest.prototype.open.calls.length).toBe(1)	  
    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('GET', '/teacher_current_slide', SYNCHRONOUS)
    expect(XMLHttpRequest.prototype.send).toHaveBeenCalled()  
    expect(XMLHttpRequest.prototype.send.calls.length).toBe(1)
    expect(getResponse).not.toBeUndefined()
	  
    postResponse = postResource('/teacher_current_slide', "1", SYNCHRONOUS)

    expect(XMLHttpRequest.prototype.open).toHaveBeenCalled()
    expect(XMLHttpRequest.prototype.open.calls.length).toBe(2)
    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('POST', '/teacher_current_slide', SYNCHRONOUS)
    expect(XMLHttpRequest.prototype.send).toHaveBeenCalled()
    expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith("1")
    expect(XMLHttpRequest.prototype.send.calls.length).toBe(2)	  
    expect(postResponse).not.toBeUndefined()	  
	  
  });	  

});
