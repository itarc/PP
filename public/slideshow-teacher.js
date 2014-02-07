// ----------------------------------
// TEACHER SLIDESHOW CLASS / EXTENDS SLIDESHOW
// ----------------------------------
var TeacherSlideShow = function(slides) {
  SlideShow.call(this, slides);
  this._postCurrentIndexOnServer();	
};

TeacherSlideShow.prototype = {
  handleKeys: function(e) {
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
        this.synchronise();
	if (this._current_slide()._isCodingSlide()) this._current_slide().updateEditorAndExecuteCode();
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

