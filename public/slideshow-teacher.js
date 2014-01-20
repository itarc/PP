// ----------------------------------
// TEACHER SLIDESHOW CLASS / EXTENDS SLIDESHOW
// ----------------------------------
var TeacherSlideShow = function(slides) {
  
  SlideShow.call(this, slides);
	
};

TeacherSlideShow.prototype = {
	
  handleKeys: function(e) {
	  
    if ( e.altKey && e.which == R) { this.executeCode() }

    switch (e.keyCode) {
	      
      case LEFT_ARROW: 

        this.prev(); 
	      
      break;
	      
      case RIGHT_ARROW:  
	      
        this.next(); 
	      
      break;
	      
      case SPACE:  
	      
        this.synchronise(); 
	      
      break;	      
	      
    }

  },	
	
};

for(key in SlideShow.prototype) {

  TeacherSlideShow.prototype[key] = SlideShow.prototype[key];

}

// ----------------------------------
// INITIALIZE SLIDESHOW
// ----------------------------------  
var teacherSlideshow = new TeacherSlideShow(queryAll('.slide'));

