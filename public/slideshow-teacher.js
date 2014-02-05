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
        currentSlide = this._slides[this._currentIndex];
        if (currentSlide._isCodingSlide()) { currentSlide.updateEditorAndExecuteCode(); }
        if (!this._isUp) { this._slides[this._numberOfSlides-1].updateEditorAndExecuteCode(); }
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

