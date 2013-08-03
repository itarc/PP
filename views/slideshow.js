// ----------------------------------
// COMMON
// ----------------------------------

var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
var SPACE = 32;

var queryAll = function(query) {

  nodeList = document.querySelectorAll(query);
  return Array.prototype.slice.call(nodeList, 0);

};

var postResource = function(path, params) {
	  
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", path, false);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send(params);	  

};

var getResource = function(path) {

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", path, false);
  xmlhttp.send();
  return xmlhttp.responseText;

};

// ----------------------------------
// SLIDE CLASS
// ----------------------------------
var Slide = function(node) {

  this._node = node;

};

Slide.prototype = {
	  
  _states: [ 'previous', 'current', 'next'],

  setState: function(state) {

    this._node.className = 'slide' + ((state != '') ? (' ' + state) : '');

  },

};

// ----------------------------------
// SLIDESHOW CLASS
// ----------------------------------  
var SlideShow = function(slides) {

  this._slides = (slides).map(function(element) {
	    
    return new Slide(element);

  });

  this._numberOfSlides = this._slides.length;

  var _t = this;
  document.addEventListener('keydown',
    function(e) { _t.handleKeys(e); }, false
  );

  this._update();

};

SlideShow.prototype = {
	
  _slides : [],
  _currentIndex : 0,
  _numberOfSlides : 0,

  _update: function() {
	
    window.console && window.console.log("_currentIndex : " + this._currentIndex);

    beforePreviousSlide = this._slides[this._currentIndex - 2]
    if (beforePreviousSlide) beforePreviousSlide.setState('');

    previousSlide = this._slides[this._currentIndex - 1]
    if (previousSlide) previousSlide.setState('previous');	    
	    
    currentSlide = this._slides[this._currentIndex]
    if (currentSlide) currentSlide.setState('current');
	    
    nextSlide = this._slides[this._currentIndex + 1]	      
    if (nextSlide) nextSlide.setState('next');
	    
    afterNextSlide = this._slides[this._currentIndex + 2]
    if (afterNextSlide) afterNextSlide.setState('');	

  },

  _getCurrentIndex: function() {

    serverIndex = parseInt(getResource('/teacher_current_slide'));
    if ( !( isNaN(serverIndex) ) ) this._currentIndex = serverIndex;

  },    

  _postCurrentIndex: function() {

    postResource('/teacher_current_slide', 'index=' + this._currentIndex);
 
  },

  prev: function() {
	    
    if (this._currentIndex <= 0) return;
	    
    this._currentIndex = this._currentIndex - 1;
    this._update();	 

    this._postCurrentIndex();

},

  next: function() {
	    
    if (this._currentIndex >= (this._numberOfSlides - 1) ) return;
	    
    this._currentIndex = this._currentIndex + 1;
    this._update();

    this._postCurrentIndex();

  },

  synchronise: function() {

    this._getCurrentIndex();
    this._update();

  },

  handleKeys: function(e) {
	    
    switch (e.keyCode) {
	      
      case LEFT_ARROW: 
	      
        this.prev(); 
	      
      break;
	      
      case RIGHT_ARROW:  
	      
        this.next(); 
	      
      break;
	      
      case SPACE:  
	      
        this.synchronise(); 
	      
      break;	      
	      
    }

  },

};


var slideshow = new SlideShow(queryAll('.slide'));

//~ var slideshowTimer = setInterval( function(){ slideshow.synchronise(); },2000);

