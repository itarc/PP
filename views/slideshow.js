// ----------------------------------
// COMMON
// ----------------------------------

var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
var SPACE = 32;

var SYNCHRONOUS = false;
var ASYNCHRONOUS = true;

var ALT = true 
var R=82

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
	
  executeButton = this._node.querySelector('#execute')
  
  if (executeButton) {
    var _t = this;   	
    executeButton.addEventListener('click',
      function(e) { _t.executeCode(); }, false
    );
  }
  
};

Slide.prototype = {
	  
  _states: [ 'previous', 'current', 'next'],

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
    url = "/code_execution_result"
    code = this._node.querySelector('#code_input').value
    this._node.querySelector('#code_output').innerHTML = postResource(url, code, SYNCHRONOUS)
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

    currentSlide = this._slides[this._currentIndex]
	  
    if (currentSlide) {
	  
      for(var slideIndex in this._slides) {

	this._slides[slideIndex].setState('')

      }
    
      currentSlide.setState('current');
      currentSlide.updatePoll();
      
    }

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
  
  executeCode: function() {

    currentSlide = this._slides[this._currentIndex]
    currentSlide.executeCode()

  },
  

  
};
