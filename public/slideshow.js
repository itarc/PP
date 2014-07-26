// ----------------------------------
// SLIDE POSITION ON SERVER 
// ----------------------------------
var Position = function(slideshow) {
  this._slideshow = slideshow;
  this._currentIndex = 0;
  this._IDEDisplayed = false;
};

Position.prototype = {
  
  getPosition: function() {
    return getResource('/teacher_current_slide');
  },
  
  _updateSlideShow: function() {
    if (this._slideshow._currentIndex != this._currentIndex || this._slideshow._IDEDisplayed != this._IDEDisplayed ) { 
      this._slideshow._currentIndex = this._currentIndex;
      this._slideshow._IDEDisplayed = this._IDEDisplayed; 
      this._slideshow._update();
    }    
  },
  
  postPosition: function(index, IDEDisplayed) {
    postResource('/teacher_current_slide', 'index=' +   index + '&' + 'ide_displayed=' + IDEDisplayed, ASYNCHRONOUS);
    this._currentIndex = index; this._IDEDisplayed = IDEDisplayed;
    this._updateSlideShow();
  },
  
  //~ updateWith: function(index, IDEDisplayed) {
    
  //~ },
  
  updateWithTeacherPosition: function() {
    serverPosition = this.getPosition();
    this._currentIndex = parseInt(serverPosition.split(';')[0]);
    this._currentIndex = is_a_number(this._currentIndex) ? this._currentIndex : 0
    this._IDEDisplayed = serverPosition.split(';')[1] == 'true' ? true : false
    this._updateSlideShow();
  },
  
};

// ----------------------------------
// SLIDESHOW CLASS
// ----------------------------------  
var SlideShow = function(slides) {
  this._numberOfSlides = slides.length;  
  this.initEvents();
  this.initSlides(slides);
  this.initPosition();
};


SlideShow.prototype = {
  _slides : [],
  _currentIndex: undefined,
  _IDEDisplayed: undefined,
  _numberOfSlides : 0,

  initEvents: function() {
    var _t = this;    
    document.addEventListener('keydown', function(e) { _t.handleKeys(e); }, false );
  },
  
  initSlides: function(slides) {
    var _t = this;
    this._slides = (slides).map(function(element) { 
      if (element.querySelector('#execute') != null) { return new CodeSlide(element, _t); };
      if (element.querySelector('.poll_response_rate') != null) { return new PollSlide(element, _t); };
      return new Slide(element, _t); 
    });
  },  

  initPosition: function() {
    this.position = new Position(this);
    this.position.updateWithTeacherPosition();    
  },  
  
  _refresh: function() {
    this.position.updateWithTeacherPosition();     
  },
  
  handleKeys: function(e) {
    preventDefaultKeys(e);
  },
  
  _clear: function() {
    for(var slideIndex in this._slides) { this._slides[slideIndex].setState('') }
  },
  
  _last_slide:function() {
    return this._slides[this._numberOfSlides-1]
  },  
  
  currentSlide: function() {
    if (this._IDEDisplayed) 
      return this._last_slide();  
    else
      if (this._slides[this._currentIndex]) { return this._slides[this._currentIndex]; } else { return  this._slides[0]; }
  },
  
  _update: function() { 
    if (this._slides.length == 0) return;  
    this._clear();	    
    this.currentSlide().setState('current'); 
    this.currentSlide()._update(this._currentIndex);    
  },  
  
};
