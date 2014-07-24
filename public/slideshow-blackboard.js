// ----------------------------------
// BLACKBOARD POLL SLIDE / EXTENDS CODE SLIDE
// ----------------------------------
var BlackboardPollSlide = function(node, slideshow) {
  PollSlide.call(this, node, slideshow);
};

BlackboardPollSlide.prototype = {
};

for(key in PollSlide.prototype) {
  if (! BlackboardPollSlide.prototype[key]) { BlackboardPollSlide.prototype[key] = PollSlide.prototype[key]; };
};

// ----------------------------------
// BLACKBOARD CODE SLIDE / EXTENDS CODE SLIDE
// ----------------------------------
var BlackboardCodeSlide = function(node, slideshow) {
  CodeSlide.call(this, node, slideshow);
  
  this._runResource = '/code_run_result_blackboard';
  this._sendResource = ''
  this._getAndRunResource = ''  
  this._updateResource = '/code_get_last_send_to_blackboard'
};

BlackboardCodeSlide.prototype = {
};

for(key in CodeSlide.prototype) {
  if (! BlackboardCodeSlide.prototype[key]) { BlackboardCodeSlide.prototype[key] = CodeSlide.prototype[key]; };
};

// ----------------------------------
// BLACKBOARD SLIDESHOW CLASS / EXTENDS SLIDESHOW
// ----------------------------------
var BlackboardSlideShow = function(slides) {
  SlideShow.call(this, slides);
};

BlackboardSlideShow.prototype = {
  
  initSlides: function(slides) {
    var _t = this;
    this._slides = (slides).map(function(element) { 
      if (element.querySelector('#execute') != null) { return new BlackboardCodeSlide(element, _t); };
      if (element.querySelector('.poll_response_rate') != null) { return new BlackboardPollSlide(element, _t); };
      return new Slide(element, _t); 
    });  
  },
  
  _refresh: function() {
    SlideShow.prototype._refresh.call(this);
    this.currentSlide()._update(this._currentIndex); 
  },  
  
  handleKeys: function(e) {
    
    SlideShow.prototype.handleKeys.call(this, e);
    
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
var slideshowTimer = setInterval( function(){ blackboardSlideShow._refresh(); },1000);

