describe("Common is_a_number", function() {
	
  it("should tell value is a number", function() {
    
    expect(is_a_number(1)).toBe(true);
    expect(is_a_number('a')).toBe(false);
    expect(is_a_number('')).toBe(false);
    expect(is_a_number(undefined)).toBe(false);
    
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

describe("Common GET", function() {  
  
  it("should GET Synchronous", function() {

    spyOn(XMLHttpRequest.prototype, 'open').and.callThrough()
    spyOn(XMLHttpRequest.prototype, 'send')	  
	  
    resource = new Resource();
    getResponse = resource.get('/teacher_current_slide')

    expect(XMLHttpRequest.prototype.open).toHaveBeenCalled()
    expect(XMLHttpRequest.prototype.open.calls.count()).toBe(1)	  
    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('GET', '/teacher_current_slide', SYNCHRONOUS)
    expect(XMLHttpRequest.prototype.send).toHaveBeenCalled()  
    expect(XMLHttpRequest.prototype.send.calls.count()).toBe(1)
    expect(getResponse).not.toBeUndefined()
	  
  });  

  it("should GET ASynchronous", function() {

    spyOn(XMLHttpRequest.prototype, 'open').and.callThrough()
    spyOn(XMLHttpRequest.prototype, 'send')

    spyOn(Resource.prototype, "_xmlhttpResponseText").and.returnValue('RESPONSE')   
    spyOn(Resource.prototype, "_asynchronousRequestDone").and.returnValue(true)   
    callbackSpy = jasmine.createSpy('callback')
	  
    resource = new Resource();
    
    getResponse = resource.get('/teacher_current_slide', ASYNCHRONOUS, this, callbackSpy);

    expect(XMLHttpRequest.prototype.open).toHaveBeenCalled()
    expect(XMLHttpRequest.prototype.open.calls.count()).toBe(1)	  
    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('GET', '/teacher_current_slide', ASYNCHRONOUS, callbackSpy)
    expect(XMLHttpRequest.prototype.send).toHaveBeenCalled()  
    expect(XMLHttpRequest.prototype.send.calls.count()).toBe(1)  
    expect(getResponse).toBeUndefined()
    
    //~ waits(1200);  

    expect(callbackSpy).toHaveBeenCalledWith('RESPONSE');
	  
  });   
  
  it("should add to url SERVER_PATH (for Hangout)", function() {

    spyOn(XMLHttpRequest.prototype, 'open').and.callThrough()
    spyOn(XMLHttpRequest.prototype, 'send')	     
    
    SERVER_PATH = '//serveur'
    
    resource = new Resource();
    getResponse = resource.get('/teacher_current_slide');    
    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('GET', SERVER_PATH + '/teacher_current_slide', SYNCHRONOUS)    
    
    SERVER_PATH = ''    
    
  });   

});

describe("Common POST", function() {
  
  it("should POST Synchronous", function() {

    spyOn(XMLHttpRequest.prototype, 'open').and.callThrough()
    spyOn(XMLHttpRequest.prototype, 'send')
	  
    resource = new Resource();
    postResponse = resource.post('/teacher_current_slide', "1", SYNCHRONOUS);    

    expect(XMLHttpRequest.prototype.open).toHaveBeenCalled()
    expect(XMLHttpRequest.prototype.open.calls.count()).toBe(1)
    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('POST', '/teacher_current_slide', SYNCHRONOUS)
    expect(XMLHttpRequest.prototype.send).toHaveBeenCalled()
    expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith("1")
    expect(XMLHttpRequest.prototype.send.calls.count()).toBe(1)	  
    expect(postResponse).not.toBeUndefined()	  
	  
  });  
  
  it("should POST ASynchronous", function() {

    spyOn(XMLHttpRequest.prototype, 'open').and.callThrough()
    spyOn(XMLHttpRequest.prototype, 'send')

    resource = new Resource();
    postResponse = resource.post('/teacher_current_slide', "1", ASYNCHRONOUS);    

    expect(XMLHttpRequest.prototype.open).toHaveBeenCalled()
    expect(XMLHttpRequest.prototype.open.calls.count()).toBe(1)
    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('POST', '/teacher_current_slide', ASYNCHRONOUS)
    expect(XMLHttpRequest.prototype.send).toHaveBeenCalled()
    expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith("1")
    expect(XMLHttpRequest.prototype.send.calls.count()).toBe(1)	  
    expect(postResponse).not.toBeUndefined()

  });
  
  it("should add to url SERVER_PATH (for Hangout)", function() {

    spyOn(XMLHttpRequest.prototype, 'open').and.callThrough()
    spyOn(XMLHttpRequest.prototype, 'send')	     
    
    SERVER_PATH = '//serveur'

    resource = new Resource();
    postResponse = resource.post('/teacher_current_slide', "", SYNCHRONOUS);    
    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('POST', SERVER_PATH + '/teacher_current_slide', SYNCHRONOUS)      
    
    SERVER_PATH = ''    
    
  });  

});
