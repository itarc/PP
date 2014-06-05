// ----------------------------------
// SLIDE POSITION ON SERVER 
// ----------------------------------
var Position = function() {
  this._currentIndex = 0;
  this._IDEDisplayed  = false;
  this._previousIndex = undefined;
  this._previousIDEDisplayed = undefined;
  this.slideShowType = undefined;
};

Position.prototype = {
  
  _synchronise: function() {
    serverData = getResource('/teacher_current_slide');
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
    postResource('/teacher_current_slide', 'index=' +   this._currentIndex + '&' + 'ide_displayed=' + this._IDEDisplayed, ASYNCHRONOUS);  
  }, 
  
  hasChanged: function() {
    return this._currentIndex != this._previousIndex || this._IDEDisplayed != this._previousIDEDisplayed
  },
  
};

// ----------------------------------
// SLIDESHOW CLASS
// ----------------------------------  
var SlideShow = function(slides) {
  this._slides = (slides).map(function(element) { 
	  if (element.querySelector('#execute') != null) { return new CodeSlide(element); };
	  if (element.querySelector('.poll_response_rate') != null) { return new PollSlide(element); };
    return new Slide(element); 
  });
  this._numberOfSlides = this._slides.length;
  this._currentSlide = this._slides[0];  

  var _t = this;
  document.addEventListener('keydown', function(e) { _t.handleKeys(e); }, false );

  this.position = new Position();
  this._refreshPosition();
  this._showCurrentSlide();

};



SlideShow.prototype = {
  _slides : [],
  _currentSlide : undefined,
  _numberOfSlides : 0,


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
    this._currentSlide._update(this.position._currentIndex, this.position.slideShowType);
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
