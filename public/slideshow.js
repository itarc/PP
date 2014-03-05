// ----------------------------------
// COMMON
// ----------------------------------

var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;
var UP_ARROW = 38;
var SPACE = 32;
var HOME = 36;

var SYNCHRONOUS = false;
var ASYNCHRONOUS = true;

var ALT = true 
var R = 82
var S = 83

var SEPARATOR = '\n#{SEP}#\n'

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
};


Slide.prototype = {
  
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
  this._codeHelpers = this._node.querySelectorAll('.code_helper');
  this._codeHelper_current_index = 0;
  this._declareEditor();
  this._declareEvents();
};

CodeSlide.prototype = {
  _codeHelpers: [],
	
  _isCodingSlide: function() {
    return this._node.querySelector('#execute') != null;
  },  

  _declareEditor: function() {
    if (typeof ace != 'undefined') { this.code_editor = ace.edit(this._node.querySelector('#code_input')); }
  }, 
  
  _declareEvents: function() {  
    var _t = this;	  
    this._node.querySelector('#code_input').addEventListener('keydown',
      function(e) { 
	if ( e.altKey ) { 
	  if (e.which == R) { _t.executeCode(_t._codeHelper_current_index); }
	  if (e.which == S) { _t.executeAndSendCode(_t._codeHelper_current_index); }
	} else {
	  e.stopPropagation()
	} 
      }, false
    );
    this._node.querySelector('#execute').addEventListener('click',
      function(e) { _t.executeCode(); }, false
    );     
    this._node.querySelector('#send_code').addEventListener('click',
      function(e) { _t.executeAndSendCode(); }, false
    );       
  },  

  _update: function(slide_index) {
    this.showCurrentCodeHelper(slide_index);
    this.updateEditorAndExecuteCode();
  },
  
  codeToExecute: function() {
    editorContent = this._node.querySelector('#code_input').value;
    if (typeof ace != 'undefined') { editorContent = this.code_editor.getValue() }
    return editorContent + this.codeToAdd();
  },	  

  executeCode: function() {
    this._node.querySelector('#code_output').value = postResource("/code_run_result" + "/" + this._codeHelper_current_index, this.codeToExecute(), SYNCHRONOUS);
  },
  
  executeAndSendCode: function() {
    this._node.querySelector('#code_output').value = postResource("/code_send_result" + "/" + this._codeHelper_current_index, this.codeToExecute(), SYNCHRONOUS);
  },  

  _clearCodeHelpers: function() {
    for (var i=0; i<this._codeHelpers.length; i++) {
      this._codeHelpers[i].className = 'code_helper';
    }
  },  
  
  showCurrentCodeHelper: function(slide_index) {
    if (this._codeHelpers.length == 0) return;
    this._clearCodeHelpers();
    this._codeHelpers[slide_index].className = 'code_helper current';
    this._codeHelper_current_index = slide_index;    	  
  },   

  updateEditor: function(code) {
    this._node.querySelector('#code_input').value = code;
    if (typeof ace != 'undefined') { this.code_editor.setValue(code, 1); }	  
  },	 

  codeToDisplay: function() {
    code = '';
    if (this._codeHelpers[this._codeHelper_current_index] && this._codeHelpers[this._codeHelper_current_index].querySelector('.code_to_display') ) 
      code = this._codeHelpers[this._codeHelper_current_index].querySelector('.code_to_display').innerHTML;
    return code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  },

  codeToAdd: function() {
    code = '';
    if (this._codeHelpers[this._codeHelper_current_index] && this._codeHelpers[this._codeHelper_current_index].querySelector('.code_to_add') ) 
      code = SEPARATOR + this._codeHelpers[this._codeHelper_current_index].querySelector('.code_to_add').innerHTML;
    return code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  },
  
  lastSend: function() {
    return getResource('/code_last_send' + '/' + this._codeHelper_current_index);
  },
  
  updateEditorAndExecuteCode: function() {
    codeForEditor = this.lastSend().split(SEPARATOR)[0];
    if (codeForEditor == '' ) codeForEditor = this.codeToDisplay();
    if (codeForEditor == '' && this.codeToAdd() == '') return;
    this.updateEditor(codeForEditor);
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
  this._currentSlide = this._slides[this._currentIndex];

  var _t = this;
  document.addEventListener('keydown', function(e) { _t.handleKeys(e); }, false );   

  this._getCurrentIndexOnServer();
  this._refresh();  
};



SlideShow.prototype = {
  _slides : [],
  _currentIndex : 0,
  _currentSlide : undefined, 
  _currentServerIndex : 0,
  _numberOfSlides : 0,
  _isUp : true,


  _clear: function() {
    for(var slideIndex in this._slides) { this._slides[slideIndex].setState('') }
  },
  
  _show_current_slide: function() {
    if (this._slides[this._currentIndex]) this._currentSlide = this._slides[this._currentIndex];
    this._clear();	    
    this._currentSlide.setState('current');
  },

  _teacher_coding_slide:function() {
    return this._slides[this._numberOfSlides-1]
  },  
  
  _show_teacher_coding_slide: function() {
    this._clear();
    this._currentSlide = this._teacher_coding_slide();	  
    this._currentSlide.setState('current');
  },	  
  
  _update_poll_slide: function() {
    if (this._currentSlide && this._currentSlide._isPollResultSlide()) {
      this._currentSlide.updatePoll();
    }
  },

  _is_a_number: function(index) {
    return  !( isNaN(index) );
  },
  
  _getCurrentIndexOnServer: function() {
    serverIndex = parseInt(getResource('/teacher_current_slide'));
    if ( this._is_a_number(serverIndex) ) this._currentIndex = serverIndex;	  
  },    

  _postCurrentIndexOnServer: function() {
    postResource('/teacher_current_slide', 'index=' + this._currentIndex, ASYNCHRONOUS);  
  },
  
  _refresh: function() {
    if (this._slides.length == 0) return
    if (this._isUp) 
	  this._show_current_slide();
    else
	this._show_teacher_coding_slide();
    this._update_poll_slide();
    this._currentSlide._update(this._currentIndex);
    window.console && window.console.log("Refreshed with this._currentIndex = " + this._currentIndex);
  }, 

  prev: function() {
    if (this._currentIndex <= 0) return;
    this._currentIndex -= 1;
    this._refresh();	  
    this._postCurrentIndexOnServer();
  },

  next: function() {
    if (this._currentIndex >= (this._numberOfSlides - 1) ) return;
    if (this._slides[this._currentIndex+1] && this._slides[this._currentIndex+1]._isCodingSlide()) return;
    this._currentIndex += 1;		  
    this._refresh();
    this._postCurrentIndexOnServer();
  },
  
  down: function() {
    this._isUp = false;
    this._refresh();  
  },
  
  up: function() {  
    this._isUp = true;	  
    this._refresh();
  },
  
  synchronise: function() {
    previous_index = this._currentIndex
    this._getCurrentIndexOnServer();
    if (this._currentIndex != previous_index) this._refresh();  
   },
  
};
