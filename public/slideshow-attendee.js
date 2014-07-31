// ----------------------------------
// ATTENDEE POLL SLIDE / EXTENDS CODE SLIDE
// ----------------------------------
var AttendeePollSlide = function(node, slideshow) {
  PollSlide.call(this, node, slideshow);
};

AttendeePollSlide.prototype = {
};

for(key in PollSlide.prototype) {
  if (! AttendeePollSlide.prototype[key]) { AttendeePollSlide.prototype[key] = PollSlide.prototype[key]; };
};

// ----------------------------------
// ATTENDEE CODE SLIDE / EXTENDS CODE SLIDE
// ----------------------------------
var AttendeeCodeSlide = function(node, slideshow) {
  CodeSlide.call(this, node, slideshow);
  
  this._runResource = '/code_run_result';
  this._sendResource = '/code_send_result';
  this._getAndRunResource = '/code_get_last_send_to_blackboard'    
  this._updateResource = '/code_last_execution'   
};

AttendeeCodeSlide.prototype = {

};

for(key in CodeSlide.prototype) {
  if (! AttendeeCodeSlide.prototype[key]) { AttendeeCodeSlide.prototype[key] = CodeSlide.prototype[key]; };
};

// ----------------------------------
// ATTENDEE SLIDESHOW CLASS / EXTENDS SLIDESHOW
// ----------------------------------
var AttendeeSlideShow = function(slides) {
  SlideShow.call(this, slides);
};

AttendeeSlideShow.prototype = {
  
  initSlides: function(slides) {
    var _t = this;
    this._slides = (slides).map(function(element) { 
      if (element.querySelector('#execute') != null) { return new AttendeeCodeSlide(element, _t); };
      if (element.querySelector('.poll_response_rate') != null) { return new AttendeePollSlide(element, _t); };
      return new Slide(element, _t); 
    }); 
  },
  
  handleKeys: function(e) {
    
    SlideShow.prototype.handleKeys.call(this, e);
    
    switch (e.keyCode) {
      case SPACE:  
        this._refresh()
      break;	      
    }
  },	
};

for(key in SlideShow.prototype) {
  if (! AttendeeSlideShow.prototype[key]) AttendeeSlideShow.prototype[key] = SlideShow.prototype[key];
}

// ----------------------------------
// INITIALIZE SLIDESHOW
// ----------------------------------  
var attendeeSlideshow = new AttendeeSlideShow(queryAll(document, '.slide'));
var slideshowTimer = setInterval( function(){ attendeeSlideshow._refresh(); },FLIP_ATTENDEE_GET_POSITION_FREQUENCY);

