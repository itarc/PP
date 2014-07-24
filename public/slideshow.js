// ----------------------------------
// SLIDE POSITION ON SERVER 
// ----------------------------------
var Position = function() {
  this._currentIndex = 0;
  this._IDEDisplayed = false;
};

Position.prototype = {
  
  getPosition: function() {
    return getResource('/teacher_current_slide');
  },
  
  postPosition: function(index, IDEDisplayed) {
    postResource('/teacher_current_slide', 'index=' +   index + '&' + 'ide_displayed=' + IDEDisplayed, ASYNCHRONOUS);
  },  
  
  _update: function() {
    serverData = this.getPosition();
    if (serverData) {
      serverIndex = parseInt(serverData.split(';')[0]);
      if ( is_a_number(serverIndex) ) {
        this._currentIndex = serverIndex;
        if (serverData.split(';')[1] == 'true') this._IDEDisplayed = true;
        if (serverData.split(';')[1] == 'false') this._IDEDisplayed = false;
      }
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
  this.initCurrentSlide();
};


SlideShow.prototype = {
  _slides : [],
  _currentIndex: 0,
  _IDEDisplayed: false,
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
    this.position = new Position();
    this.position._update();
    this._currentIndex = this.position._currentIndex;
    this._IDEDisplayed = this.position._IDEDisplayed;
  },  
  
  initCurrentSlide: function() {
    this._update();
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
    
  _showCurrentSlide: function() {  
    //~ if (this._slides.length == 0) return;  
    this._clear();	    
    this.currentSlide().setState('current');    
    window.console && window.console.log("Refreshed with this._currentIndex = " + this._currentIndex + " and this._showIDE = " + this._IDEDisplayed);
  },

  _updateCurrentSlide: function() {
    if (this._slides.length == 0) return; 
    this.currentSlide()._update(this._currentIndex);
  },  
  
  _refresh: function() {
    this.position._update();
    if (this._currentIndex != this.position._currentIndex || this._IDEDisplayed != this.position._IDEDisplayed) { 
      this._currentIndex = this.position._currentIndex;
      this._IDEDisplayed = this.position._IDEDisplayed; 
      this._update();
    }
  },
  
  _update: function() {
    this._showCurrentSlide();  
    this._updateCurrentSlide();   
  },  
  
};
