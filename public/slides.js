// ----------------------------------
// SLIDE CLASS
// ----------------------------------
var Slide = function(node, slideshow) {
  this._node = node;
  this._slideshow = slideshow;
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
var PollSlide = function(node, slideshow) {
  Slide.call(this, node, slideshow);
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
// EXECUTION CONTEXT
// ----------------------------------
var ServerExecutionContext = function(slide) {
  this._slide = slide;
  this.author = '';
  this.code = '';
  this.code_to_add = '';
}

ServerExecutionContext.prototype = {
  
  isEmpty: function() {
    return this.author == '' && this.code == '' && this.code_to_add == '';
  },

  codeToExecute: function() {
    codeToExecute = this.code;
    if (this.code_to_add != '') codeToExecute += ( SEPARATOR + this.code_to_add)
    return codeToExecute;
  },   

  canReplaceCurrentExecutionContext: function() {
    return ( ! this.isEmpty() ) && (this.codeToExecute() != this._slide.codeToExecute());
  },  
  
  slideShowType: function() {
    if (this._slide) return this._slide.slideShowType();
  },  
  
  executionContextResourceURL: function() {
    if (this.slideShowType() == 'blackboard') {
      return '/code_get_last_send_to_blackboard';
    } else {
      return '/code_last_execution';
    }    
  },
  
  getContextOnServer: function(url) {
    last_execution = getResource(url);
    author = last_execution.split(SEPARATOR)[0];
    code_and_code_to_add = last_execution.split(SEPARATOR)[1];
    code = (code_and_code_to_add && code_and_code_to_add.split(SEPARATOR)[0]) ? code_and_code_to_add.split(SEPARATOR)[0] : '';
    code_to_add = (code_and_code_to_add && code_and_code_to_add.split(SEPARATOR)[1]) ? code_and_code_to_add.split(SEPARATOR)[1] : '';
    return { "author": author, "code" : code, "code_to_add" : code_to_add };   
  },
  
  updateWithResource: function(resourceURL) {
    newServerExecutionContext = this.getContextOnServer(resourceURL + '/' + this._slide._codeHelper_current_index);
    this.author = newServerExecutionContext.author;
    this.code = (newServerExecutionContext.code == '') ? this._slide.codeToDisplay() : newServerExecutionContext.code;
    this.code_to_add = (newServerExecutionContext.code_to_add == '') ? this._slide.codeToAdd() : newServerExecutionContext.code_to_add;
  },
  
  update: function(context) {
    defaultResourceURL = this.executionContextResourceURL();
    this.updateWithResource(defaultResourceURL);
  },
}



// ----------------------------------
// EDITOR
// ----------------------------------
var Editor = function(node) {
  this._node = node;
  this._contentHasChanged;
  this.updated = true;
  this.notUpdated = false;
}

Editor.prototype = {
  content: function() {
    return this._node.value;
  },
  
  updateWithText: function(code) {
    this._node.value = code;  
  },
  
  update: function(context, executionContext) {
    this.updateWithText(executionContext.code);      
    context._authorBar.updateWithAuthorName(executionContext.author);             
  },
}

// ----------------------------------
// AUTHOR BAR
// ----------------------------------
var AuthorBar = function(node) {
  this._node = node;
  this.getSessionID();
  this.refresh();
}

AuthorBar.prototype = {
  
  getSessionID: function() {
    this._sessionID = getResource('/session_id');
  },
  
  createSessionID: function(newAuthor) {
    if (newAuthor == '') return;
    postResource('session_id/attendee_name', 'attendee_name=' + newAuthor, SYNCHRONOUS);
    this._sessionID = newAuthor;
    this.updateWithAuthorName(this._sessionID);
  },
  
  updateWithAuthorName: function(author) {
    if (this._node) { 
      if (author.split('_')[1]) { this._author = author.split('_')[1]; } else { this._author = author; }
      if (is_a_number(author)) {
        if (author == '0') { this._author = '#'; } else { this._author = '?'; }
      }      
      this._node.innerHTML = this._author;
    };
  },
  
  refresh: function() {
    this.updateWithAuthorName(this._sessionID);
  },
  
}

// ----------------------------------
// CODE HELPER (MINI-SLIDE)
// ----------------------------------
var CodeHelper = function(node, slideNode) {
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
var CodeSlide = function(node, slideshow) {
  Slide.call(this, node, slideshow);
  
  var _s = this;
  
  this._codeHelpers = (queryAll(node, '.code_helper')).map(function(element) {
    return new CodeHelper(element, _s); 
  });
  
  this._codeHelper_current_index = 0;
  this._declareEvents();
  this._serverExecutionContext = new ServerExecutionContext(this);
  this._editor = new Editor(this._node.querySelector('#code_input'));
  this._authorBar = new AuthorBar(this._node.querySelector('#author_name'));

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
      if (e.which == N) { this._node.querySelector('#get_last_send').click();}
    } else {
      e.stopPropagation()
    }    
  },
  
  _declareEvents: function() {  
    var _t = this;   
    if (_t._node.querySelector('#attendee_name')) {
    this._node.querySelector('#attendee_name').addEventListener('keydown',
      function(e) { 
        if (e.keyCode == RETURN) { 
          _t._authorBar.createSessionID(this.value); this.value = '';
        } }, false
    );
    }
    this._node.querySelector('#code_input').addEventListener('keydown',
      function(e) { _t._keyHandling(e); }, false
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
    if (this._node.querySelector('#get_last_send')) {
      this._node.querySelector('#get_last_send').addEventListener('click',
        function(e) { _t._updateEditorWithLastSendAndExecute() }, false
      );
    };
  },
  
  _clearCodeHelpers: function() {
    for (var i=0; i<this._codeHelpers.length; i++) {
      this._codeHelpers[i].setState('');
    }
  }, 

  _currentCodeHelper: function() {
    return this._codeHelpers[this._codeHelper_current_index]
  },   
  
  showCodeHelper: function(slide_index) {
    if (this._codeHelpers.length == 0) return;
    this._clearCodeHelpers();
    this._codeHelpers[slide_index].setState('current');
    this._codeHelper_current_index = slide_index;    	  
  }, 

  updateEditor: function(code) {
    this._editor.updateWithText(code);
  },   
  
  codeToExecute: function() {
    return this._editor.content() + this._currentCodeHelper().codeToAdd();
  },	 

  codeToDisplay: function() {
    return this._currentCodeHelper().codeToDisplay();
  },	 
  
  codeToAdd: function() {
    return this._currentCodeHelper().codeToAdd();
  },

  slideShowType: function() {
    if (this._slideshow) return this._slideshow.slideShowType;
  },

  runResource: function() {
    if (this._slideshow) { return this._slideshow.runResource; } else { return '/code_run_result' };
  },
  
  sendResource: function() {
    return '/code_send_result'
  },  

  _clearStandardOutput: function() {
    this._node.querySelector('#code_output').value = '';
  }, 
  
  _updateStandardOutputWith: function(text) {
    this._node.querySelector('#code_output').value = text;
  },   
  
  _updateLastSendAttendeeNameWith: function(name) {
    this._node.querySelector('#last_send_attendee_name').innerHTML = name;
  },     
  
  executeCodeAt: function(url) {
    if (this.codeToExecute() == '' ) return;
    url += ("/" + this._codeHelper_current_index);
    executionResult = postResource(url, this.codeToExecute(), SYNCHRONOUS);
    this._clearStandardOutput();   
    this._updateStandardOutputWith(executionResult);     
  },
  
  executeCode: function() {
    this.executeCodeAt(this.runResource());
    if (this.slideShowType() != 'blackboard') this._authorBar.refresh();
  },
  
  executeAndSendCode: function() {
    this.executeCodeAt(this.sendResource());
  },

  getAndExecuteCode: function() {
    this._serverExecutionContext.updateWithResource('/code_get_last_send_to_blackboard');
    if (this._serverExecutionContext.canReplaceCurrentExecutionContext()) {
      this._editor.update(this, this._serverExecutionContext);
      this.executeCode(); 
    }
  }, 

  _updateEditorWithLastSendAndExecute: function() {
    this._serverExecutionContext.updateWithResource('/code_attendees_last_send');
    if (this._serverExecutionContext.canReplaceCurrentExecutionContext()) {
      this.updateEditor(this._serverExecutionContext.code);        
      this.executeAndSendCode();
      this._authorBar.updateWithAuthorName(this._serverExecutionContext.author);
    }
  },
  
  lastSendAttendeeName: function(attendee_name) {
    if (attendee_name.split('_')[1]) attendee_name = attendee_name.split('_')[1];
    if (attendee_name != '' ) attendee_name += ' >> ';
    return attendee_name;
  },  
  
  _updateLastSendAttendeeName: function(slide_index) {
    if ( this._node.querySelector('#last_send_attendee_name') ) {
      this._serverExecutionContext.updateWithResource('/code_attendees_last_send');
      this._updateLastSendAttendeeNameWith(this.lastSendAttendeeName(this._serverExecutionContext.author));
    }
  },
  
  _update: function(slide_index, slideShowType) {
    this.showCodeHelper(slide_index);
    this._updateLastSendAttendeeName();
    this._serverExecutionContext.update();
    if (this._serverExecutionContext.canReplaceCurrentExecutionContext()) {
        this._editor.update(this, this._serverExecutionContext);
        this.executeCode();
    }
  },
  
};

for(key in Slide.prototype) {
  if (! CodeSlide.prototype[key]) CodeSlide.prototype[key] = Slide.prototype[key];
};

