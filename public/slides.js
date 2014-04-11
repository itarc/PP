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
};

CodeSlide.prototype = {
  _codeHelpers: [],
	
  _isCodingSlide: function() {
    return this._node.querySelector('#execute') != null;
  },
  
  _keyHandling: function(e) {
    if ( e.altKey ) { 
      if (e.which == R) { if ( ! this._node.querySelector('#execute').disabled == true ) this.executeCode(); }
      if (e.which == S) { if ( ! this._node.querySelector('#send_code').disabled == true ) this.executeAndSendCode(); }
      if (e.which == G) { if ( ! this._node.querySelector('#get_code').disabled == true ) this.getAndExecuteCode(); }
    } else {
      e.stopPropagation()
    }    
  },
  
  _declareEvents: function() {  
    var _t = this;	  
    this._node.querySelector('#code_input').addEventListener('keydown',
      function(e) { _t._keyHandling(e) }, false
    );
    this._node.querySelector('#execute').addEventListener('click',
      function(e) { _t.executeCode(); }, false
    );     
    this._node.querySelector('#send_code').addEventListener('click',
      function(e) { _t.executeAndSendCode(); }, false
    );     
    this._node.querySelector('#get_code').addEventListener('click',
      function(e) { _t.getAndExecuteCode(); }, false
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

  executeCode: function() {
    if (this.codeToExecute() == '' ) return;
    this._node.querySelector('#execute').style.background = "red";    
    run_url = "/code_run_result" + "/" + this._codeHelper_current_index;
    this._node.querySelector('#code_output').value = postResource(run_url , this.codeToExecute(), SYNCHRONOUS);
    this._node.querySelector('#execute').style.background = "";    
  },
  
  executeAndSendCode: function() {
    if (this.codeToExecute() == '' ) return;   
    this._node.querySelector('#send_code').style.background = "red";     
    send_url = "/code_send_result" + "/" + this._codeHelper_current_index;
    this._node.querySelector('#code_output').value = postResource(send_url, this.codeToExecute(), SYNCHRONOUS);
    this._node.querySelector('#send_code').style.background = "";    
  },

  getAndExecuteCode: function() {  
    this._node.querySelector('#get_code').style.background = "red";       
    get_url = "/code_get_last_teacher_run" + "/" + this._codeHelper_current_index;
    code = getResource(get_url).split(SEPARATOR)[0];
    this._editor.updateEditor(code);
    run_url = "/code_run_result" + "/" + this._codeHelper_current_index;
    this._node.querySelector('#code_output').value = postResource(run_url , this.codeToExecute(), SYNCHRONOUS);    
    this._node.querySelector('#get_code').style.background = "";    
  }, 

  lastExecution: function(context) {
    url = '/code_last_execution'
    if (context == 'blackboard') { url = '/code_get_last_teacher_run'; }
    return getResource(url + '/' + this._codeHelper_current_index);
  },  
  
  _updateEditorAndExecuteCode: function(context) {
    lastexecution = this.lastExecution(context); 
    if (lastexecution != '') { 
      if (lastexecution.split(SEPARATOR)[0] != this._editor.content()) { 
        this._editor.updateEditor(lastexecution.split(SEPARATOR)[0]); 
        this.executeCode();
      };
      return;
    }
    codeToDisplay = this._currentCodeHelper().codeToDisplay(); 
    if (codeToDisplay != '') { 
      if (codeToDisplay != this._editor.content()) { 
        this._editor.updateEditor(codeToDisplay); 
        this.executeCode();
        };
      return;
    }
    codeToAdd = this._currentCodeHelper().codeToAdd();
    if (codeToAdd != '') {
      this._editor.updateEditor(''); 
      this.executeCode();
    }
  },
  
  _update: function(slide_index, context) {
    this.showCurrentCodeHelper(slide_index);
    this._updateEditorAndExecuteCode(context);
  },
  
};

for(key in Slide.prototype) {
  if (! CodeSlide.prototype[key]) CodeSlide.prototype[key] = Slide.prototype[key];
};