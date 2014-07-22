// ----------------------------------
// SLIDE POSITION ON SERVER 
// ----------------------------------
var Position = function() {
  this._currentIndex = 0;
  this._IDEDisplayed  = false;
  this._previousIndex = undefined;
  this._previousIDEDisplayed = undefined;
};

Position.prototype = {
  
  getPosition: function() {
    return getResource('/teacher_current_slide');
  },
  
  postPosition: function(index, IDEDisplayed) {
    postResource('/teacher_current_slide', 'index=' +   index + '&' + 'ide_displayed=' + IDEDisplayed, ASYNCHRONOUS);
  },  
  
  _synchronise: function() {
    serverData = this.getPosition();
    if (serverData) {
      serverIndex = parseInt(serverData.split(';')[0]);
      if ( is_a_number(serverIndex) ) {
        this._previousIndex = this._currentIndex;
        this._currentIndex = serverIndex;
        serverIDEDisplayed = serverData.split(';')[1]
        if (serverIDEDisplayed) {
          this._previousIDEDisplayed = this._IDEDisplayed;
          if (serverIDEDisplayed == 'true') this._IDEDisplayed = true;
          if (serverIDEDisplayed == 'false') this._IDEDisplayed = false;
        }
      }
    }
  },
  
  postCurrentIndex: function() {  
    this.postPosition(this._currentIndex, this._IDEDisplayed);  
  }, 
  
  hasChanged: function() {
    return this._currentIndex != this._previousIndex || this._IDEDisplayed != this._previousIDEDisplayed
  },
  
};

// ----------------------------------
// SLIDESHOW CLASS
// ----------------------------------  
var SlideShow = function(slides) {
  this.initEvents();
  this.initSlides(slides);
  this.initPosition();
  this._showCurrentSlide();  
};


SlideShow.prototype = {
  _slides : [],
  _currentIndex: 0,
  _IDEDisplayed: false,
  _currentSlide : undefined,
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
    this._numberOfSlides = this._slides.length;
  },  

  initPosition: function() {
    this.position = new Position();
    this._refreshPosition();
    this._currentIndex = this.position._currentIndex;
    this._IDEDisplayed = this.position._IDEDisplayed;
    this._currentSlide = this._slides[0];
  },  
  
  handleKeys: function(e) {
    preventDefaultKeys(e);
  },
  
  _clear: function() {
    for(var slideIndex in this._slides) { this._slides[slideIndex].setState('') }
  },
  
  _showClassicSlide: function() {
    if (this._slides[this.position._currentIndex]) this._currentSlide = this._slides[this.position._currentIndex];
    this._clear();	    
    this._currentSlide.setState('current');
  },

  _last_slide:function() {
    return this._slides[this._numberOfSlides-1]
  },  
  
  _showIDESlide: function() {
    this._clear();
    this._currentSlide = this._last_slide();  
    this._currentSlide.setState('current');
  },
  
  _refreshPosition: function() {
    this.position._synchronise();
  },     
    
  _showCurrentSlide: function() {  
    if (this._slides.length == 0) return;       
    if (this.position._IDEDisplayed) 
      this._showIDESlide();
    else
      this._showClassicSlide();
    window.console && window.console.log("Refreshed with this._currentIndex = " + this.position._currentIndex + " and this._showIDE = " + this.position._IDEDisplayed);
  },

  _updateCurrentSlide: function() {
    if (this._slides.length == 0) return; 
    this._currentSlide._update(this.position._currentIndex);
  },  
  
  _refresh: function() {
    this._refreshPosition();  
    if (this.position.hasChanged()) { this._showCurrentSlide(); this._updateCurrentSlide();}
  },

  prev: function() {
    if (this.position._currentIndex <= 0) return;
    this.position._currentIndex -= 1;
    this._showCurrentSlide();	 
    this._updateCurrentSlide();    
    this.position.postCurrentIndex();
  },

  next: function() {
    if (this.position._currentIndex >= (this._numberOfSlides - 1) ) return;
    if (this._slides[this.position._currentIndex+1] && this._slides[this.position._currentIndex+1]._isCodingSlide()) return;		  
    this.position._currentIndex += 1;		  
    this._showCurrentSlide();
    this._updateCurrentSlide();    
    this.position.postCurrentIndex();    
  },
  
  down: function() {
    if (! this._last_slide()._isCodingSlide()) return;    
    this.position._IDEDisplayed = true;
    this._showCurrentSlide(); 
    this._updateCurrentSlide();    
    this.position.postCurrentIndex();
  },
  
  up: function() {
    this.position._IDEDisplayed = false;	  
    this._showCurrentSlide();
    this._updateCurrentSlide();    
    this.position.postCurrentIndex();     
  },
  
};
