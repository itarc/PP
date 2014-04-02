// ----------------------------------
// TEACHER SLIDESHOW CLASS / EXTENDS SLIDESHOW
// ----------------------------------
var TeacherSlideShow = function(slides) {
  SlideShow.call(this, slides);
  this._SlideShowServer.postCurrentIndex(this._currentIndex, this._showIDE);  
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
        this._refresh();	    
      break;	
      case HOME:  
        this._currentIndex = 0;
        this._refresh();
        this._SlideShowServer.postCurrentIndex(this._currentIndex, this._showIDE);      
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
var teacherSlideshow = new TeacherSlideShow(queryAll(document, '.slide'));

