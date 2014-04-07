// ----------------------------------
// ATTENDEE SLIDESHOW CLASS / EXTENDS SLIDESHOW
// ----------------------------------
var AttendeeSlideShow = function(slides) {
  SlideShow.call(this, slides);
  this._updateCurrentSlide();    
};

AttendeeSlideShow.prototype = {
  handleKeys: function(e) {
    switch (e.keyCode) {
      case SPACE:  
        this._refresh()
      break;	      
    }
  },	
};

for(key in SlideShow.prototype) {
  AttendeeSlideShow.prototype[key] = SlideShow.prototype[key];
}

// ----------------------------------
// INITIALIZE SLIDESHOW
// ----------------------------------  
var attendeeSlideshow = new AttendeeSlideShow(queryAll(document, '.slide'));
var slideshowTimer = setInterval( function(){ attendeeSlideshow._refresh(); },2000);

