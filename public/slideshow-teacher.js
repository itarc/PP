// ----------------------------------
// TEACHER SLIDESHOW CLASS / EXTENDS SLIDESHOW
// ----------------------------------
var TeacherSlideShow = function(slides) {
  SlideShow.call(this, slides); 
  this.position.slideShowType = 'teacher';  
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
}

// ----------------------------------
// INITIALIZE SLIDESHOW
// ----------------------------------  
var teacherSlideshow = new TeacherSlideShow(queryAll(document, '.slide'));
var slideshowTimer = setInterval( function(){ teacherSlideshow._refresh(); },2000);
