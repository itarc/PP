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

var postResource = function(path, params, synchronous_asynchronous) {
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
  //~ if (this._isCodingSlide()) { }
};



Slide.prototype = {
  _states: [ 'previous', 'current', 'next'],
  
  _isPollResultSlide: function() {
    return this._node.querySelectorAll('.poll_response_rate').length > 0  
  },
  
  _update: function() {

  },
  
  _isCodingSlide: function() {
    return false;
  },   

  setState: function(state) {
    this._node.className = 'slide' + ((state != '') ? (' ' + state) : '');
  },
  
  updatePoll: function() {
    rateNodes = this._node.querySelectorAll('.poll_response_rate')
    for (var i=0; i<rateNodes.length; i++) {
      rateNodeId = '#' + rateNodes[i].id;
      rateNodeValue = "(" + getResource('/' + rateNodes[i].id) + "%)"
      this._node.querySelector(rateNodeId).innerHTML = rateNodeValue;
    }
  },
  
  savePoll: function(elementId) {
    postResource('/'+elementId, '', ASYNCHRONOUS);
  }, 


};

// ----------------------------------
// CODE SLIDE EXTENDS SLIDE CLASS
// ----------------------------------
var CodeSlide = function(node) {
  Slide.call(this, node);
  this._initializeCodingSlide(); 	
};

CodeSlide.prototype = {
	
  _isCodingSlide: function() {
    return this._node.querySelector('#execute') != null;
  },  

  _initializeCodingSlide: function() {
    var _t = this;
    if (typeof ace != 'undefined') { this.code_editor = ace.edit(this._node.querySelector('#code_input')); }
    this._node.querySelector('#code_input').addEventListener('keydown',
      function(e) { if ( e.altKey && e.which == R) { _t.executeCode(); } else {e.stopPropagation()} }, false
    );
    this._node.querySelector('#execute').addEventListener('click',
      function(e) { _t.executeCode(); }, false
    );      
  },  

  executeCode: function() {
    url = "/code_run_result";
    code = this._node.querySelector('#code_input').value;
    if (typeof ace != 'undefined') { code = this.code_editor.getValue() }
    
    this._node.querySelector('#code_output').value = postResource(url, code, SYNCHRONOUS);
  },   
  
  _update: function(slide_index) {
    this.updateCodingSlideHelpers(slide_index);
  },
  
  updateCodingSlideHelpers: function(slide_index) {
    codeHelpers = this._node.querySelectorAll('.code_helper');
    if (codeHelpers.length == 0) return;
    for (var i=0; i<codeHelpers.length; i++) {
      codeHelpers[i].className = 'code_helper';
    }
    codeHelpers[slide_index].className = 'code_helper current';	  
  },   
  
  updateEditorAndExecuteCode: function(slide_index) {
    if (! this._isCodingSlide()) return;
    code = getResource('/code_last_run');
    this._node.querySelector('#code_input').value = code;
    if (typeof ace != 'undefined') { this.code_editor.setValue(code, 1) }
    this.executeCode();	  
  }, 
  
};

for(key in Slide.prototype) {
  if (! CodeSlide.prototype[key]) CodeSlide.prototype[key] = Slide.prototype[key];
};


// ----------------------------------
// SLIDESHOW CLASS
// ----------------------------------  
var SlideShow = function(slides) {
  this._slides = (slides).map(function(element) { 
	  if (element.querySelector('#execute') != null) { 
	    return new CodeSlide(element); 
	  } else { 
	    return new Slide(element); 
	  };
  });
  this._numberOfSlides = this._slides.length;

  var _t = this;
  document.addEventListener('keydown', function(e) { _t.handleKeys(e); }, false );   

  this._show_current_slide();
  this._update_poll_slide();
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
    if (! this._isUp) return this._coding_slide();
    return this._slides[this._currentIndex];
  },

  _coding_slide:function() {
    return this._slides[this._numberOfSlides-1]
  },
  
  _show_current_slide: function() {
    window.console && window.console.log("_currentIndex : " + this._currentIndex);
    window.console && window.console.log("_currentServerIndex : " + this._currentServerIndex);
    if (this._current_slide()) {
      this._clean();
      this._current_slide().setState('current');
    }
  },
  
  _update_poll_slide: function() {
    if (this._current_slide() && this._current_slide()._isPollResultSlide()) {
      this._current_slide().updatePoll();
    }
  },  
  
  _update_coding_slide:function() {
    if (this._current_slide()) this._current_slide()._update(this._currentServerIndex);
  },  

  _is_a_number: function(index) {
	return  !( isNaN(index) )
  },
  
  _getCurrentIndexOnServer: function() {
    serverIndex = parseInt(getResource('/teacher_current_slide'));
    if ( this._is_a_number(serverIndex) ) this._currentServerIndex = serverIndex;
    if (this._numberOfSlides == 0 ) this._currentIndex = this._currentServerIndex;
    if (this._currentServerIndex <= (this._numberOfSlides -1) ) this._currentIndex = this._currentServerIndex;
  },    

  _postCurrentIndexOnServer: function() {
    postResource('/teacher_current_slide', 'index=' + this._currentIndex, ASYNCHRONOUS);  
  },

  prev: function() {
    if (this._currentIndex <= 0) return;
    this._currentIndex -= 1;
    this._currentServerIndex = this._currentIndex;	  
    if (this._isUp) this._show_current_slide();
    this._update_poll_slide();
    this._update_coding_slide();	  
    this._postCurrentIndexOnServer();
  },

  next: function() {
    if (this._currentIndex >= (this._numberOfSlides - 1) ) return;
    if (this._slides[this._currentIndex+1] && this._slides[this._currentIndex+1]._isCodingSlide()) return;
    this._currentIndex += 1;
    this._currentServerIndex = this._currentIndex;		  
    if (this._isUp) this._show_current_slide();
    this._update_poll_slide();
    this._update_coding_slide();
    this._postCurrentIndexOnServer();
  },
  
  down: function() {
    this._clean();
    this._coding_slide().setState('current');
    this._isUp = false;
    this._update_coding_slide();  
  },
  
  up: function() {
    this._isUp = true;
    this._show_current_slide();	  
  },

  synchronise: function() {
    this._getCurrentIndexOnServer();
    if (this._isUp) this._show_current_slide(); 
    this._update_coding_slide();
  },
};
