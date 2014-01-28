// ----------------------------------
// COMMON
// ----------------------------------

var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;
var UP_ARROW = 38;
var SPACE = 32;

var SYNCHRONOUS = false;
var ASYNCHRONOUS = true;

var ALT = true 
var R = 82

var queryAll = function(query) {
  nodeList = document.querySelectorAll(query);
  return Array.prototype.slice.call(nodeList, 0);
};

var postResource = function(path, params, synchronous_asynchronous = ASYNCHRONOUS) {
  var xmlhttp = new XMLHttpRequest();	
  xmlhttp.open("POST", path, synchronous_asynchronous);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send(params);	
  return xmlhttp.responseText;
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

  if (this._isCodingSlide()) { this._initializeCodingSlide(); }
};



Slide.prototype = {
  _states: [ 'previous', 'current', 'next'],
	
  _isCodingSlide: function() {
    return this._node.querySelector('#execute');
  },
  
  _isPollResultSlide: function() {
    return this._node.querySelectorAll('.poll_response_rate').length > 0  
  },
  
  _initializeCodingSlide: function() {
    var _t = this;
    if (typeof ace != 'undefined') { this.code_editor = ace.edit(this._node.querySelector('#code_input')); }
    if (typeof ace != 'undefined') { this.code_helper = ace.edit(this._node.querySelector('#code_helper')); }
    this._node.querySelector('#code_input').addEventListener('keydown',
      function(e) { if ( e.altKey && e.which == R) { _t.executeCode(); } else {e.stopPropagation()} }, false
    );
    this._node.querySelector('#execute').addEventListener('click',
      function(e) { _t.executeCode(); }, false
    );      
  },

  setState: function(state) {
    this._node.className = 'slide' + ((state != '') ? (' ' + state) : '');
  },
  
  updatePoll: function() {
    if (! this._isPollResultSlide()) return;
    rateNodes = this._node.querySelectorAll('.poll_response_rate')
    for (var i=0; i<rateNodes.length; i++) {
      rateNodeId = '#' + rateNodes[i].id;
      rateNodeValue = "(" + getResource('/' + rateNodes[i].id) + "%)"
      this._node.querySelector(rateNodeId).innerHTML = rateNodeValue;
    }
  },
  
  updateCodingSlide: function(slide_index) {
    if(! this._isCodingSlide()) return;
    codeHelpers = this._node.querySelectorAll('.code_helper');
    for (var i=0; i<codeHelpers.length; i++) {
      codeHelpers[i].className = 'code_helper';
    }
    codeHelpers[slide_index].className = 'code_helper current';	  
  }, 
  
  savePoll: function(elementId) {
    postResource('/'+elementId, '');
  }, 

  executeCode: function() {
    url = "/code_run_result";
    code = this._node.querySelector('#code_input').value;
    if (typeof ace != 'undefined') { code = this.code_editor.getValue() }
    
    this._node.querySelector('#code_output').value = postResource(url, code, SYNCHRONOUS);
  }, 
};

// ----------------------------------
// SLIDESHOW CLASS
// ----------------------------------  
var SlideShow = function(slides) {
  this._slides = (slides).map(function(element) { return new Slide(element); });
  this._numberOfSlides = this._slides.length;

  var _t = this;
  document.addEventListener('keydown', function(e) { _t.handleKeys(e); }, false );   

  this._update_current_slide_state();
  this._update_poll();
  this._update_coding_slide();  
};



SlideShow.prototype = {
  _slides : [],
  _currentIndex : 0,
  _currentServerIndex : 0,
  _numberOfSlides : 0,
  _isUp : true,

  _clean: function() {
    for(var slideIndex in this._slides) { this._slides[slideIndex].setState('') }
  },

  _current_slide: function() {
    return this._slides[this._currentIndex];
  },  
  
  _update_current_slide_state: function() {
    window.console && window.console.log("_currentIndex : " + this._currentIndex);
    window.console && window.console.log("_currentServerIndex : " + this._currentServerIndex);
    if (this._current_slide()) {
      this._clean();
      this._current_slide().setState('current');
    }
  },
  
  _update_poll: function() {
    if (this._current_slide()) {
      this._current_slide().updatePoll();
    }
  },  
  
  _update_coding_slide:function() {
    if (this._current_slide()) { 
      this._current_slide().updateCodingSlide(this._currentServerIndex); 
    }
  },  

  _getCurrentIndex: function() {
    serverIndex = parseInt(getResource('/teacher_current_slide'));
    if ( !( isNaN(serverIndex) ) ) this._currentServerIndex = serverIndex;
    if (this._numberOfSlides == 0 ) { this._currentIndex = this._currentServerIndex; }
    if (this._currentServerIndex <= (this._numberOfSlides -1) ) { this._currentIndex = this._currentServerIndex; }
  },    

  _postCurrentIndex: function() {
    postResource('/teacher_current_slide', 'index=' + this._currentIndex);
  },

  prev: function() {
    if (this._currentIndex <= 0) return;
    this._currentIndex = this._currentIndex - 1;
    if (this._isUp) this._update_current_slide_state();
    this._update_poll();
    this._update_coding_slide();	  
    this._postCurrentIndex();
  },

  next: function() {
    if (this._currentIndex >= (this._numberOfSlides - 1) ) return;
    this._currentIndex = this._currentIndex + 1;
    if (this._isUp) this._update_current_slide_state();
    this._update_poll();
    this._update_coding_slide();	  
    this._postCurrentIndex();
  },
  
  down: function() {
    this._clean();
    this._slides[this._numberOfSlides-1].setState('current');
    this._isUp = false;
  },
  
  up: function() {
    this._isUp = true;
    this._update_current_slide_state();	  
  },

  synchronise: function() {
    this._getCurrentIndex();
    this._update_current_slide_state(); 
    this._update_coding_slide();
  },
};
