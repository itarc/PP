describe("Poll Slide", function() {
	
  it("should update poll rates", function() {
  
    pollSlideNode = sandbox("<div class='slide'><section><div><span id='poll_rate_1' class='poll_response_rate'></span><span id='poll_rate_2' class='poll_response_rate'></span></section></div>");

    expect(pollSlideNode.querySelector('#poll_rate_1').innerHTML).toBe('');
    expect(pollSlideNode.querySelector('#poll_rate_2').innerHTML).toBe('');
	  
    spyOn(Resource.prototype, "get").and.returnValue('50');    
	  
    var pollSlide = new PollSlide(pollSlideNode);
    pollSlide._update();
    
    expect(Resource.prototype.get).toHaveBeenCalled();
    expect(Resource.prototype.get.calls.count()).toBe(2);
    expect(Resource.prototype.get).toHaveBeenCalledWith('/poll_rate_1');
    expect(Resource.prototype.get).toHaveBeenCalledWith('/poll_rate_2');     
	  
    expect(pollSlideNode.querySelector('#poll_rate_1').innerHTML).toBe('(50%)');
    expect(pollSlideNode.querySelector('#poll_rate_2').innerHTML).toBe('(50%)');
    
  });
  
  it("should post a poll answer", function() {
  
    pollSlideNode = sandbox('<input class="poll_radio" type="radio" id="poll_radio_1" name="group_1" onclick="PollSlide.prototype.savePoll(this.id)"> <label id="label_1" for="poll_radio_1">ANSWER_1</label>  <input class="poll_radio" type="radio" id="poll_radio_2" name="group_1" onclick="PollSlide.prototype.savePoll(this.id)"> <label id="label_1" for="poll_radio_2">ANSWER_2</label> ');
    spyOn(Resource.prototype, 'post');    

    var pollSlide = new PollSlide(pollSlideNode);
	  
    pollSlideNode.querySelector('#poll_radio_1').click();	  
	  
    expect(Resource.prototype.post).toHaveBeenCalled();
    expect(Resource.prototype.post.calls.count()).toBe(1);
    expect(Resource.prototype.post).toHaveBeenCalledWith('/poll_radio_1', '', ASYNCHRONOUS);
	  
    pollSlideNode.querySelector('#poll_radio_2').click();
	  
    expect(Resource.prototype.post).toHaveBeenCalled();
    expect(Resource.prototype.post.calls.count()).toBe(2);
    expect(Resource.prototype.post).toHaveBeenCalledWith('/poll_radio_2','', ASYNCHRONOUS);
    
  });
  
});
