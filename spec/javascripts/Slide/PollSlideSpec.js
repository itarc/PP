describe("Slide : Poll", function() {

  it("should NOT update poll rates if slide is NOT a poll result", function() {
  
    slideNode = sandbox("<div class='slide'><section><div><span id='poll_rate_1'></span></section></div>");

    expect(slideNode.querySelector('#poll_rate_1').innerHTML).toBe('');
	  
    var slide = new Slide(slideNode);
    slide.updatePoll();
	  
    expect(slideNode.querySelector('#poll_rate_1').innerHTML).toBe('');
    
  });	
	
  it("should update poll rates if slide is a poll result", function() {
  
    slideNode = sandbox("<div class='slide'><section><div><span id='poll_rate_1' class='poll_response_rate'></span><span id='poll_rate_2' class='poll_response_rate'></span></section></div>");

    expect(slideNode.querySelector('#poll_rate_1').innerHTML).toBe('');
    expect(slideNode.querySelector('#poll_rate_2').innerHTML).toBe('');
	  
    getResource = jasmine.createSpy('getResource').andReturn('50');  
	  
    var slide = new Slide(slideNode);
    slide.updatePoll();
	  
    expect(getResource).toHaveBeenCalled();
    expect(getResource.calls.length).toBe(2);
    expect(getResource).toHaveBeenCalledWith('/poll_rate_1');
    expect(getResource).toHaveBeenCalledWith('/poll_rate_2');  
	  
    expect(slideNode.querySelector('#poll_rate_1').innerHTML).toBe('(50%)');
    expect(slideNode.querySelector('#poll_rate_2').innerHTML).toBe('(50%)');
    
  });
  
  it("should post poll choosen answer", function() {
  
    slideNode = sandbox('	  <input class="poll_radio" type="radio" id="poll_radio_1" name="group_1" onclick="Slide.prototype.savePoll(this.id)"> <label id="label_1" for="poll_radio_1">ANSWER_1</label>  <input class="poll_radio" type="radio" id="poll_radio_2" name="group_1" onclick="Slide.prototype.savePoll(this.id)"> <label id="label_1" for="poll_radio_2">ANSWER_2</label> ');
	  //~ alert(slideshow._slides[slideshow._currentIndex])
    postResource = jasmine.createSpy('postResource');  
	  function a() { alert("a") }
    var slide = new Slide(slideNode);
	  //~ alert(slideNode)
    //~ slide.savePoll();
	  
    slideNode.querySelector('#poll_radio_1').click();	  
	  
    expect(postResource).toHaveBeenCalled();
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/poll_radio_1','');
	  
    slideNode.querySelector('#poll_radio_2').click();
	  
    expect(postResource).toHaveBeenCalled();
    expect(postResource.calls.length).toBe(2);
    expect(postResource).toHaveBeenCalledWith('/poll_radio_2','');
    
  });
  
});

