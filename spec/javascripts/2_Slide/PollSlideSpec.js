describe("Poll Slide", function() {

  //~ it("should NOT update poll rates if slide is NOT a poll result", function() {
  
    //~ slideNode = sandbox("<div class='slide'><section><div><span id='poll_rate_1'></span></section></div>");

    //~ expect(slideNode.querySelector('#poll_rate_1').innerHTML).toBe('');
	  
    //~ var slide = new Slide(slideNode);
    //~ slide.updatePoll();
	  
    //~ expect(slideNode.querySelector('#poll_rate_1').innerHTML).toBe('');
    
  //~ });	
	
  it("should update poll rates if slide is a poll result", function() {
  
    pollSlideNode = sandbox("<div class='slide'><section><div><span id='poll_rate_1' class='poll_response_rate'></span><span id='poll_rate_2' class='poll_response_rate'></span></section></div>");

    expect(pollSlideNode.querySelector('#poll_rate_1').innerHTML).toBe('');
    expect(pollSlideNode.querySelector('#poll_rate_2').innerHTML).toBe('');
	  
    getResource = jasmine.createSpy('getResource').andReturn('50');  
	  
    var pollSlide = new PollSlide(pollSlideNode);
    pollSlide._update();
	  
    expect(getResource).toHaveBeenCalled();
    expect(getResource.calls.length).toBe(2);
    expect(getResource).toHaveBeenCalledWith('/poll_rate_1');
    expect(getResource).toHaveBeenCalledWith('/poll_rate_2');  
	  
    expect(pollSlideNode.querySelector('#poll_rate_1').innerHTML).toBe('(50%)');
    expect(pollSlideNode.querySelector('#poll_rate_2').innerHTML).toBe('(50%)');
    
  });
  
  it("should post poll choosen answer", function() {
  
    pollSlideNode = sandbox('	  <input class="poll_radio" type="radio" id="poll_radio_1" name="group_1" onclick="PollSlide.prototype.savePoll(this.id)"> <label id="label_1" for="poll_radio_1">ANSWER_1</label>  <input class="poll_radio" type="radio" id="poll_radio_2" name="group_1" onclick="PollSlide.prototype.savePoll(this.id)"> <label id="label_1" for="poll_radio_2">ANSWER_2</label> ');
    postResource = jasmine.createSpy('postResource');  

    var pollSlide = new PollSlide(pollSlideNode);
	  
    pollSlideNode.querySelector('#poll_radio_1').click();	  
	  
    expect(postResource).toHaveBeenCalled();
    expect(postResource.calls.length).toBe(1);
    expect(postResource).toHaveBeenCalledWith('/poll_radio_1', '', ASYNCHRONOUS);
	  
    pollSlideNode.querySelector('#poll_radio_2').click();
	  
    expect(postResource).toHaveBeenCalled();
    expect(postResource.calls.length).toBe(2);
    expect(postResource).toHaveBeenCalledWith('/poll_radio_2','', ASYNCHRONOUS);
    
  });
  
});
