// ----------------------------------
// TEACHER SLIDESHOW CLASS / EXTENDS SLIDESHOW
// ----------------------------------
var AttendeeSlideShow = function(slides) {
  
  SlideShow.call(this, slides);
	
};

AttendeeSlideShow.prototype = {
	
  handleKeys: function(e) {
	    
    switch (e.keyCode) {
	      
      case SPACE:  
	      
        this.synchronise(); 
	      
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
var attendeeSlideshow = new AttendeeSlideShow(queryAll('.slide'));
var slideshowTimer = setInterval( function(){ attendeeSlideshow.synchronise(); },2000);

