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

describe("Common GET", function() {

  it("should GET Synchronous", function() {

    spyOn(XMLHttpRequest.prototype, 'open').andCallThrough()
    spyOn(XMLHttpRequest.prototype, 'send')	  
	  
    getResponse = getResource('/teacher_current_slide')

    expect(XMLHttpRequest.prototype.open).toHaveBeenCalled()
    expect(XMLHttpRequest.prototype.open.calls.length).toBe(1)	  
    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('GET', '/teacher_current_slide', SYNCHRONOUS)
    expect(XMLHttpRequest.prototype.send).toHaveBeenCalled()  
    expect(XMLHttpRequest.prototype.send.calls.length).toBe(1)
    expect(getResponse).not.toBeUndefined()
	  
  });  
  
  it("should GET ASynchronous", function() {

    spyOn(XMLHttpRequest.prototype, 'open').andCallThrough()
    spyOn(XMLHttpRequest.prototype, 'send')	  
    
    function callback(response) {
      return false;
    }    
    
    callbackSpy = jasmine.createSpy('callback')
	  
    getResponse = getResource('/teacher_current_slide', ASYNCHRONOUS, callback)

    expect(XMLHttpRequest.prototype.open).toHaveBeenCalled()
    expect(XMLHttpRequest.prototype.open.calls.length).toBe(1)	  
    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('GET', '/teacher_current_slide', ASYNCHRONOUS, callback)
    expect(XMLHttpRequest.prototype.send).toHaveBeenCalled()  
    expect(XMLHttpRequest.prototype.send.calls.length).toBe(1)  
    expect(getResponse).toBeUndefined()

    //~ waitsFor(function() {
      //~ return callback();
    //~ }, "the spreadsheet calculation to complete", 10000);
    
    //~ waits(1500);    
    
    //~ expect(callbackSpy).toHaveBeenCalled()
	  
  });   
  
  it("should concatenate url with global variable SERVER_PATH", function() {

    spyOn(XMLHttpRequest.prototype, 'open').andCallThrough()
    spyOn(XMLHttpRequest.prototype, 'send')	     
    
    SERVER_PATH = '//serveur'
    
    getResponse = getResource('/teacher_current_slide')
    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('GET', SERVER_PATH + '/teacher_current_slide', SYNCHRONOUS)    
    
    SERVER_PATH = ''    
    
  });  

});

describe("Common POST", function() {
  
  it("should POST Synchronous", function() {

    spyOn(XMLHttpRequest.prototype, 'open').andCallThrough()
    spyOn(XMLHttpRequest.prototype, 'send')
	  
    postResponse = postResource('/teacher_current_slide', "1", SYNCHRONOUS)

    expect(XMLHttpRequest.prototype.open).toHaveBeenCalled()
    expect(XMLHttpRequest.prototype.open.calls.length).toBe(1)
    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('POST', '/teacher_current_slide', SYNCHRONOUS)
    expect(XMLHttpRequest.prototype.send).toHaveBeenCalled()
    expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith("1")
    expect(XMLHttpRequest.prototype.send.calls.length).toBe(1)	  
    expect(postResponse).not.toBeUndefined()	  
	  
  });   
  
  it("should POST ASynchronous", function() {

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
  
  it("should concatenate url with global variable SERVER_PATH", function() {

    spyOn(XMLHttpRequest.prototype, 'open').andCallThrough()
    spyOn(XMLHttpRequest.prototype, 'send')	     
    
    SERVER_PATH = '//serveur'
    
    postResponse = postResource('/teacher_current_slide', "", SYNCHRONOUS)
    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('POST', SERVER_PATH + '/teacher_current_slide', SYNCHRONOUS)      
    
    SERVER_PATH = ''    
    
  });  

});
