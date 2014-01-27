// ----------------------------------
// COMMON
// ----------------------------------

var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
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
    pollRateNodeList = this._node.querySelectorAll('.poll_response_rate')
    if ( pollRateNodeList.length ==  0 ) return;
    for (var pollRateNodeIndex in pollRateNodeList) {
	    pollRateNodeId = pollRateNodeList[pollRateNodeIndex].id
	    if (! pollRateNodeId) continue;
	    pollRate = getResource('/' + pollRateNodeId);
	    this._node.querySelector('#' + pollRateNodeId).innerHTML = "(" + pollRate + "%)";
    }

  },
  
  savePoll: function(elementId) {
    postResource('/'+elementId, '');
  }, 

  executeCode: function() {
    url = "/code_run_result"; code = this._node.querySelector('#code_input').value;
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

  this._update();
};



SlideShow.prototype = {
  _slides : [],
  _currentIndex : 0,
  _numberOfSlides : 0,

  _clean: function() {
    for(var slideIndex in this._slides) { this._slides[slideIndex].setState('') }
  },

  _current_slide: function() {
    return this._slides[this._currentIndex];
  },  
  
  _update_current_slide_state: function() {
    window.console && window.console.log("_currentIndex : " + this._currentIndex);
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

  _update: function() {
    this._update_current_slide_state();
    this._update_poll();
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
    this._update_current_slide_state();
  },
};
