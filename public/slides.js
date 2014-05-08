// ----------------------------------
// SLIDE CLASS
// ----------------------------------
var Slide = function(node) {
  this._node = node;
};


Slide.prototype = {

  _update: function() {
  },
  
  _isPollResultSlide: function() {
    return false;  
  },

  _isCodingSlide: function() {
    return false;
  },   

  setState: function(state) {
    this._node.className = 'slide' + ((state != '') ? (' ' + state) : '');
  },

};

// ----------------------------------
// POLL SLIDE CLASS
// ----------------------------------
var PollSlide = function(node) {
  Slide.call(this, node);
  this._node = node;
}

PollSlide.prototype = {
  _isPollResultSlide: function() {
    return this._node.querySelectorAll('.poll_response_rate').length > 0  
  },
  savePoll: function(elementId) {
    postResource('/'+elementId, '', ASYNCHRONOUS);
  },   
  _update: function() {
    rateNodes = this._node.querySelectorAll('.poll_response_rate')
    for (var i=0; i<rateNodes.length; i++) {
      rateNodeId = '#' + rateNodes[i].id;
      rateNodeValue = "(" + getResource('/' + rateNodes[i].id) + "%)"
      this._node.querySelector(rateNodeId).innerHTML = rateNodeValue;
    }
  },
}

for(key in Slide.prototype) {
  if (! PollSlide.prototype[key]) PollSlide.prototype[key] = Slide.prototype[key];
};

// ----------------------------------
// EDITOR
// ----------------------------------
var Editor = function(node) {
  this._node = node;
}

Editor.prototype = {
  content: function() {
    return this._node.value;
  },
  updateEditor: function(code) {
    this._node.value = code;  
  },
}

// ----------------------------------
// CODE HELPER (MINI-SLIDE)
// ----------------------------------
var CodeHelper = function(node) {
  this._node = node;
}

CodeHelper.prototype = {
  setState: function(state) {
    this._node.className = 'code_helper' + ((state != '') ? (' ' + state) : '');
  },  
  codeToAdd: function() {
    code = '';
    if (this._node.querySelector('.code_to_add') ) 
      code = SEPARATOR + this._node.querySelector('.code_to_add').innerHTML;
    return code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  }, 
  codeToDisplay: function() {
    code = '';
    if (this._node.querySelector('.code_to_display') ) 
      code = this._node.querySelector('.code_to_display').innerHTML;
    return code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  },  
}

// ----------------------------------
// CODE SLIDE EXTENDS SLIDE CLASS
// ----------------------------------
var CodeSlide = function(node) {
  Slide.call(this, node);
  
  this._codeHelpers = (queryAll(node, '.code_helper')).map(function(element) {
    return new CodeHelper(element); 
  });
  
  this._codeHelper_current_index = 0;
  this._declareEvents();
  this._editor = new Editor(this._node.querySelector('#code_input'));
  this._author = '';
  
};

CodeSlide.prototype = {
  _codeHelpers: [],
	
  _isCodingSlide: function() {
    return this._node.querySelector('#execute') != null;
  },
  
  _keyHandling: function(e) {
    
    preventDefaultKeys(e);
    
    if ( e.altKey ) { 
      if (e.which == R) { this._node.querySelector('#execute').click(); }
      if (e.which == S) { this._node.querySelector('#send_code').click(); }
      if (e.which == G) { this._node.querySelector('#get_code').click(); }
    } else {
      e.stopPropagation()
    }    
  },
  
  _declareEvents: function() {  
    var _t = this;	  
    this._node.querySelector('#code_input').addEventListener('keydown',
      function(e) { _t._keyHandling(e); }, false
    );
    this._node.querySelector('#execute').addEventListener('click',
      function(e) { 
        _t._node.querySelector('#execute').style.background = "red"; 
        _t._author = '';
        _t.executeCode(); 
        _t._node.querySelector('#execute').style.background = "";}, false
    );     
    this._node.querySelector('#send_code').addEventListener('click',
      function(e) { 
        _t._node.querySelector('#send_code').style.background = "red";  
        _t.executeAndSendCode(); 
        _t._node.querySelector('#send_code').style.background = ""; }, false
    );     
    this._node.querySelector('#get_code').addEventListener('click',
      function(e) {
        _t._node.querySelector('#get_code').style.background = "red";
        _t.getAndExecuteCode(); 
        _t._node.querySelector('#get_code').style.background = "";}, false
    );        
  },
  
  _clearCodeHelpers: function() {
    for (var i=0; i<this._codeHelpers.length; i++) {
      this._codeHelpers[i].setState('');
    }
  }, 

  _currentCodeHelper: function() {
    return this._codeHelpers[this._codeHelper_current_index]
  },   
  
  showCurrentCodeHelper: function(slide_index) {
    if (this._codeHelpers.length == 0) return;
    this._clearCodeHelpers();
    this._codeHelpers[slide_index].setState('current');
    this._codeHelper_current_index = slide_index;    	  
  },  
  
  codeToExecute: function() {
    return this._editor.content() + this._currentCodeHelper().codeToAdd();
  },	  

  executeCode: function(slideShowType) {
    if (this.codeToExecute() == '' ) return;
    run_url = "/code_run_result" + "/" + this._codeHelper_current_index;
    if (slideShowType == 'blackboard') { run_url = '/code_run_result_blackboard' + "/" + this._codeHelper_current_index; }    
    this._node.querySelector('#code_output').value = postResource(run_url , this.codeToExecute(), SYNCHRONOUS);
    this._node.querySelector('#author_name').innerHTML = this._author;    
  },
  
  executeAndSendCode: function() {
    if (this.codeToExecute() == '' ) return;      
    send_url = "/code_send_result" + "/" + this._codeHelper_current_index;
    this._node.querySelector('#code_output').value = postResource(send_url, this.codeToExecute(), SYNCHRONOUS);   
  },

  getAndExecuteCode: function() {         
    get_url = "/code_get_last_teacher_run" + "/" + this._codeHelper_current_index;
    code = getResource(get_url).split(SEPARATOR)[0];
    this._editor.updateEditor(code);
    this.executeCode();
  }, 

  lastExecution: function(slideShowType) {
    url = '/code_last_execution'
    if (slideShowType == 'blackboard') { url = '/code_get_last_teacher_run'; }
    return getResource(url + '/' + this._codeHelper_current_index);
  },  

  attendeesLastSend: function(slideShowType) {
    url = '/code_attendees_last_send'
    return getResource(url + '/' + this._codeHelper_current_index);
  },    
  
  _updateEditorAndExecuteCode: function(slideShowType) {
    if (slideShowType == 'teacher') {
      attendeeLastSend = this.attendeesLastSend(slideShowType);
      if (attendeeLastSend == '') {
        this._author = '';
        lastexecution = this.lastExecution(slideShowType); 
      } else {
        this._author = attendeeLastSend.split('#|||||#')[0];
        lastexecution = attendeeLastSend.split('#|||||#')[1];
      }
    } else {
      this._author = '';      
      lastexecution = this.lastExecution(slideShowType);
    }
    if (lastexecution != '') { 
      if (lastexecution.split(SEPARATOR)[0] != this._editor.content()) { 
        this._editor.updateEditor(lastexecution.split(SEPARATOR)[0]);        
        this.executeCode(slideShowType);
      };
      return;
    }
    codeToDisplay = this._currentCodeHelper().codeToDisplay(); 
    if (codeToDisplay != '') { 
      if (codeToDisplay != this._editor.content()) { 
        this._editor.updateEditor(codeToDisplay); 
        this.executeCode(slideShowType);
        };
      return;
    }
    codeToAdd = this._currentCodeHelper().codeToAdd();
    if (codeToAdd != '') {
      this._editor.updateEditor(''); 
      this.executeCode(slideShowType);
    }
  },
  
  _update: function(slide_index, slideShowType) {
    this.showCurrentCodeHelper(slide_index);
    this._updateEditorAndExecuteCode(slideShowType);
  },
  
};

for(key in Slide.prototype) {
  if (! CodeSlide.prototype[key]) CodeSlide.prototype[key] = Slide.prototype[key];
};