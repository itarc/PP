// ----------------------------------
// SLIDE POSITION ON SERVER 
// ----------------------------------
var Position = function(slideshow) {
  this._slideshow = slideshow;
  this._currentIndex = 0;
  this._IDEDisplayed = false;
  this._positionResource = new Resource();
};

Position.prototype = {
  
  _getPosition: function(synchronous_asynchronous) {
    if (synchronous_asynchronous == ASYNCHRONOUS) { 
      this._positionResource.get('/teacher_current_slide', ASYNCHRONOUS, this, this._updateSlideShowWith);
    } else {
      return this._positionResource.get('/teacher_current_slide');
    }
  },
  
  _postPosition: function(index, IDEDisplayed) {
    this._positionResource.post('/teacher_current_slide', 'index=' +   index + '&' + 'ide_displayed=' + IDEDisplayed, ASYNCHRONOUS);
    this._currentIndex = index; this._IDEDisplayed = IDEDisplayed;
  },  
  
  _updateSlideShow: function() {
    if (this._slideshow._currentIndex != this._currentIndex || this._slideshow._IDEDisplayed != this._IDEDisplayed ) { 
      this._slideshow._currentIndex = this._currentIndex;
      this._slideshow._IDEDisplayed = this._IDEDisplayed; 
      this._slideshow._update();
    }    
  },

  _parsePosition: function(teacherPosition) {
    this._currentIndex = parseInt(teacherPosition.split(';')[0]);
    this._currentIndex = is_a_number(this._currentIndex) ? this._currentIndex : 0
    this._IDEDisplayed = teacherPosition.split(';')[1] == 'true' ? true : false    
  },
  
  _updateSlideShowWith: function(teacherPosition) {
      this._parsePosition(teacherPosition);
      this._updateSlideShow();
  },  

  updateWith: function(index, IDEDisplayed) {
    this._postPosition(index, IDEDisplayed);
    this._updateSlideShow();
  },
  
  updateWithTeacherPosition: function() {
    if (FLIP_GET_POSITION_SYNC_ASYNC == ASYNCHRONOUS) {
      this._getPosition(ASYNCHRONOUS);      
    } else {
      teacherPosition = this._getPosition(SYNCHRONOUS);
      this._updateSlideShowWith(teacherPosition);
    }
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
    this.currentSlide()._update();    
  },  
  
};
