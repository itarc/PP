// ----------------------------------
// BLACKBOARD SLIDESHOW CLASS / EXTENDS SLIDESHOW
// ----------------------------------
var BlackboardSlideShow = function(slides) {
  SlideShow.call(this, slides);
  this.position.context = 'blackboard';
  this._updateCurrentSlide();  
};

BlackboardSlideShow.prototype = {
  
  _refresh: function() {
    this._refreshPosition();
    if (this.position.hasChanged()) { this._showCurrentSlide(); };
    this._updateCurrentSlide();
  },  
  
  handleKeys: function(e) {
    switch (e.keyCode) {
      case SPACE:  
        this._refresh();
      break;	      
    }
  },	
};

for(key in SlideShow.prototype) {
  if (! BlackboardSlideShow.prototype[key]) BlackboardSlideShow.prototype[key] = SlideShow.prototype[key];
}

// ----------------------------------
// INITIALIZE SLIDESHOW
// ----------------------------------  
var blackboardSlideShow = new BlackboardSlideShow(queryAll(document, '.slide'));
var slideshowTimer = setInterval( function(){ blackboardSlideShow._refresh(); },2000);

