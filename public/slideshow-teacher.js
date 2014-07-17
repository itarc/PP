// ----------------------------------
// TEACHER CODE SLIDE / EXTENDS CODE SLIDE
// ----------------------------------
var TeacherCodeSlide = function(slides, slideshow) {
  CodeSlide.call(this, slides, slideshow);
};

TeacherCodeSlide.prototype = {
  
 _updateLastSendAttendeeName: function(slide_index) {
    if ( this._node.querySelector('#last_send_attendee_name') ) {
      this._serverExecutionContext.updateWithResource('/code_attendees_last_send');
      this._authorBar.updateLastSendAttendeeNameWith(this._serverExecutionContext.author);
    }
  },  
  
  _update: function(slide_index) {
    CodeSlide.prototype._update.call(this, slide_index);
    this._updateLastSendAttendeeName();    
  }
  
};

for(key in CodeSlide.prototype) {
  if (! TeacherCodeSlide.prototype[key]) { TeacherCodeSlide.prototype[key] = CodeSlide.prototype[key]; };
};

// ----------------------------------
// TEACHER SLIDESHOW CLASS / EXTENDS SLIDESHOW
// ----------------------------------
var TeacherSlideShow = function(slides) {
  SlideShow.call(this, slides); 
  
  var _t = this;
  
  this._slides = (slides).map(function(element) { 
	  if (element.querySelector('#execute') != null) { return new TeacherCodeSlide(element, _t); };
	  if (element.querySelector('.poll_response_rate') != null) { return new PollSlide(element, _t); };
    return new Slide(element, _t); 
  });
  
  this.slideShowType = 'teacher';  
  this._runResource = '/code_run_result'; 
  this._sendResource = '/code_send_result'
  this._updateResource = '/code_last_execution'  
  this.position.postCurrentIndex();
  this._updateCurrentSlide();  
};

TeacherSlideShow.prototype = {
  
  _refresh: function() {
    this._last_slide()._updateLastSendAttendeeName();
  },  
  
  handleKeys: function(e) {
    
    SlideShow.prototype.handleKeys.call(this, e);
    
    switch (e.keyCode) {
      case LEFT_ARROW: 
        this.prev(); 
      break;
      case RIGHT_ARROW:  
        this.next(); 
      break;
      case DOWN_ARROW:
        this.down();
      break;
      case UP_ARROW:
        this.up();
      break;	    
      case SPACE:
        this._refreshPosition();       
        this._showCurrentSlide(); 
        this._updateCurrentSlide(); 
      break;	
      case HOME:  
        this.position._currentIndex = 0;
        this._showCurrentSlide();
        this._updateCurrentSlide();
        this.position.postCurrentIndex();      
      break;		    
    }
  },	
};

for(key in SlideShow.prototype) {
  if (! TeacherSlideShow.prototype[key]) TeacherSlideShow.prototype[key] = SlideShow.prototype[key];
};

// ----------------------------------
// INITIALIZE SLIDESHOW
// ----------------------------------  
var teacherSlideshow = new TeacherSlideShow(queryAll(document, '.slide'));
var slideshowTimer = setInterval( function(){ teacherSlideshow._refresh(); },2000);
