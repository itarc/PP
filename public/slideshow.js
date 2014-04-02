// ----------------------------------
// SLIDESHOW SERVER 
// ----------------------------------
var SlideShowServer = function() {
  this._currentServerIndex = 0;
  this._IDEDisplayed  = false;
};

SlideShowServer.prototype = {
  
  _synchronise: function() {
    serverData = getResource('/teacher_current_slide');
    if (serverData) {
      serverIndex = parseInt(serverData.split(';')[0]);
      
      if ( is_a_number(serverIndex) ) {
        this._currentServerIndex = serverIndex;
        serverIDEDisplayed = serverData.split(';')[1]
        if (serverIDEDisplayed) {
          if (serverIDEDisplayed == 'true') this._IDEDisplayed = true;
          if (serverIDEDisplayed == 'false') this._IDEDisplayed = false;
        }
      }
    }
  },
  
  postCurrentIndex: function(index, IDEDisplayed) {
    postResource('/teacher_current_slide', 'index=' + index + '&' + 'ide_displayed=' + IDEDisplayed, ASYNCHRONOUS);  
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
  this._currentSlide = this._slides[this._currentIndex];

  var _t = this;
  document.addEventListener('keydown', function(e) { _t.handleKeys(e); }, false );

  this._SlideShowServer = new SlideShowServer();
  this._SlideShowServer._synchronise();
  
  this._currentIndex = this._SlideShowServer._currentServerIndex;
  this._showIDE = this._SlideShowServer._IDEDisplayed;
  
  this._refresh();  
};



SlideShow.prototype = {
  _slides : [],
  _currentIndex : 0,
  _currentSlide : undefined,
  _numberOfSlides : 0,
  _showIDE : false,


  _clear: function() {
    for(var slideIndex in this._slides) { this._slides[slideIndex].setState('') }
  },
  
  _showCurrentSlide: function() {
    if (this._slides[this._currentIndex]) this._currentSlide = this._slides[this._currentIndex];
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
  
  _refresh: function() { 
    if (this._slides.length == 0) return;
    if (this._showIDE) 
      this._showIDESlide();
    else
      this._showCurrentSlide();
    this._currentSlide._update(this._currentIndex);
    window.console && window.console.log("Refreshed with this._currentIndex = " + this._currentIndex + " and this._showIDE = " + this._showIDE);
  }, 

  prev: function() {
    if (this._currentIndex <= 0) return;
    this._currentIndex -= 1;
    this._refresh();	  
    this._SlideShowServer.postCurrentIndex(this._currentIndex, this._showIDE);
  },

  next: function() {
    if (this._currentIndex >= (this._numberOfSlides - 1) ) return;
    if (this._slides[this._currentIndex+1] && this._slides[this._currentIndex+1]._isCodingSlide()) return;
    this._currentIndex += 1;		  
    this._refresh();
    this._SlideShowServer.postCurrentIndex(this._currentIndex, this._showIDE);    
  },
  
  down: function() {
    if (! this._last_slide()._isCodingSlide()) return;    
    this._showIDE = true;
    this._refresh(); 
    this._SlideShowServer.postCurrentIndex(this._currentIndex, this._showIDE);     
  },
  
  up: function() {
    this._showIDE = false;	  
    this._refresh();
    this._SlideShowServer.postCurrentIndex(this._currentIndex, this._showIDE);     
  },
  
  synchronise: function() {
    previous_index = this._currentIndex; previous_showIDE = this._showIDE;
    this._SlideShowServer._synchronise();
    if (this._SlideShowServer._currentServerIndex != previous_index  || this._SlideShowServer._IDEDisplayed != previous_showIDE) {
      this._currentIndex = this._SlideShowServer._currentServerIndex;
      this._showIDE = this._SlideShowServer._IDEDisplayed;       
      this._refresh();
    }
   },
  
};
