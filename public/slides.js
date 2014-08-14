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
    new Resource().post('/'+elementId, '', ASYNCHRONOUS); // ////// New Resource to place in the constructor
  },   
  _update: function() {
    rateNodes = this._node.querySelectorAll('.poll_response_rate')
    for (var i=0; i<rateNodes.length; i++) {
      rateNodeId = '#' + rateNodes[i].id;
      rateNodeValue = "(" + ( new Resource().get('/' + rateNodes[i].id) ) + "%)" // /////// New Resource to place in the constructor
      this._node.querySelector(rateNodeId).innerHTML = rateNodeValue;
    }
  },
}

for(key in Slide.prototype) {
  if (! PollSlide.prototype[key]) PollSlide.prototype[key] = Slide.prototype[key];
};

// ----------------------------------
// SERVER EXECUTION CONTEXT
// ----------------------------------
var ServerExecutionContext = function(slide) {
  this._slide = slide;
  this.author = '';
  this.code = '';
  this.code_to_add = '';
  this._executionContextResource = new Resource();  
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
  
  getContextOnServer: function(url) {
    last_execution = (this._executionContextResource.get(url)).split(SEPARATOR);
    author = last_execution[0];
    code = (last_execution[1]) ? last_execution[1] : '';
    code_to_add = (last_execution[2]) ? last_execution[2] : '';
    return { "author": author, "code" : code, "code_to_add" : code_to_add };   
  },
  
  updateWithResource: function(resourceURL) {
    newServerExecutionContext = this.getContextOnServer(resourceURL + '/' + this._slide._codeHelpers._currentIndex);
    this.author = newServerExecutionContext.author;
    this.code = newServerExecutionContext.code;
    this.code_to_add = newServerExecutionContext.code_to_add;
  },

}

// ----------------------------------
// AUTHOR BAR
// ----------------------------------
var AuthorBar = function(node) {
  this.UNKNOWN = '?';
  
  this._node = node;
  if (this._node) this.authorNode = this._node.querySelector('#author_name');
  if (this._node) this.lastsendNode = this._node.querySelector('#last_send_attendee_name');
  
  this._sessionIDResource = new Resource();
  this.refreshSessionUserName();
}

AuthorBar.prototype = {
  
  refreshSessionUserName: function() {
    sessionUserName = this._sessionIDResource.get('/session_id/user_name');
    this.updateAuthorNameWith(sessionUserName);
  },
  
  _setSessionUserName: function(newAuthor) {
    if (newAuthor == '') return;
    this._sessionIDResource.post('session_id/user_name', 'user_name=' + newAuthor, SYNCHRONOUS);
    this.refreshSessionUserName();
  },
  
  updateAuthorNameWith: function(userName) {
    if (! this.authorNode) return;
    if (userName == '')  { userName = this.UNKNOWN; }
    this.userName = userName;
    this.authorNode.innerHTML = this.userName
  },
  
  updateLastSendAttendeeNameWith: function(userName) {
    if (! this.lastsendNode) return;
    if (userName != '' ) { userName += (' >>' + ' '); }
    this.lastsendNode.innerHTML = userName;
  },
  
}

// ----------------------------------
// EDITOR
// ----------------------------------
var Editor = function(node, slide) {
  this._node = node;
  this._slide = slide;
  this._authorBar = new AuthorBar(slide._node.querySelector('.code_author'));  
}

Editor.prototype = {
  content: function() {
    return this._node.value;
  },
  
  updateWithText: function(code) {
    this._node.value = code;  
  },
  
  updateWithLocalExecutionContext: function() {
    if (this._slide.codeToAdd() == '' && this._slide.codeToDisplay() == '') return false;
    if (this._slide.codeToAdd() != '') { this.updateWithText(this._slide.codeToDisplay()); return true}
    if (this._slide.codeToDisplay() != this.content()) { this.updateWithText(this._slide.codeToDisplay()); return true}
  },
  
  updateWithServerExecutionContext: function() {
    if (  this._slide._serverExecutionContext.codeToExecute() == this._slide.codeToExecute() 
          && this._authorBar.userName == this._slide._serverExecutionContext.author) return false;
    this.updateWithText(this._slide._serverExecutionContext.code);
    this._authorBar.updateAuthorNameWith(this._slide._serverExecutionContext.author);      
    return true
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
// STANDARD OUTPUT
// ----------------------------------

var StandardOutput = function(node) {
  this._node = node;
  this.clear();
}

StandardOutput.prototype = {
  clear: function() {
    this._node.value = '';
  },  

  content: function(text) {
    return this._node.value;
  },  
  
  updateWith: function(text) {
    this._node.value = text;
  },
}

// ----------------------------------
// CODE HELPERS
// ----------------------------------

var CodeHelpers = function(codeHelpers, slide) {
  this._currentIndex = 0;  
  this._codeHelpers = (codeHelpers).map(function(element) {
    return new CodeHelper(element, slide); 
  });  
  this._slide = slide;
}

CodeHelpers.prototype = {
  _clear: function() {
    for (var i=0; i<this._codeHelpers.length; i++) {
      this._codeHelpers[i].setState('');
    }
  },  
  update: function() {
    this._clear();    
    this._currentIndex = (this._slide._editor._authorBar.userName == this._slide._editor._authorBar.UNKNOWN) ? 0 : this._slide._slideshow._currentIndex;
    this._codeHelpers[this._currentIndex].setState('current');     
  },
  current: function() {
    return this._codeHelpers[this._currentIndex]    
  },  
}

// ----------------------------------
// CODE SLIDE EXTENDS SLIDE CLASS
// ----------------------------------
var CodeSlide = function(node, slideshow) {
  Slide.call(this, node, slideshow);
  
  this._declareEvents();
  this._serverExecutionContext = new ServerExecutionContext(this);
  this._editor = new Editor(this._node.querySelector('#code_input'), this);
  this._standardOutput = new StandardOutput(this._node.querySelector('#code_output'));
  this._codeHelpers = new CodeHelpers(queryAll(node, '.code_helper'), this);   
  
  this._runResource = '/code_run_result';
  this._sendResource = '/code_send_result';
  this._getAndRunResource = '/code_get_last_send_to_blackboard'    
  this._updateResource = '/code_last_execution'    
  
  this._executionResource = new Resource();
};

CodeSlide.prototype = {
  _codeHelpers: [],
	
  _isCodingSlide: function() {
    return this._node.querySelector('#execute') != null;
  },
  
  _keyHandling: function(e) {
    
    this._slideshow._preventDefaultKeys(e);
    
    if ( e.altKey ) { 
      this._bindKeys(e);
    } else {
      e.stopPropagation()
    }    
  },
  
  _bindKeys: function(e) {  
      if (e.which == R) { this._node.querySelector('#execute').click(); }
      if (e.which == S) { this._node.querySelector('#send_code').click(); }
      if (e.which == G) { this._node.querySelector('#get_code').click(); }
      if (e.which == N) { this._node.querySelector('#get_last_send').click();}    
  },
  
  _declareEvents: function() {  
    var _t = this;   
    if (_t._node.querySelector('#attendee_name')) {
    this._node.querySelector('#attendee_name').addEventListener('keydown',
      function(e) { 
        if (e.keyCode == RETURN) { 
          _t._editor._authorBar._setSessionUserName(this.value); this.value = '';
          _t._codeHelpers.update();          
        } else {
          e.stopPropagation();
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
      function(e) { _t.executeCodeAt(_t._sendResource); }, false
    );     
    this._node.querySelector('#get_code').addEventListener('click',
      function(e) { 
        _t._serverExecutionContext.updateWithResource(_t._getAndRunResource); 
        if (_t._editor.updateWithServerExecutionContext()) { _t.executeCodeAt(_t._runResource); }
      }, false
    );
  },  
  
  codeToExecute: function() {
    return this._editor.content() + this.codeToAdd();
  },	 

  codeToDisplay: function() {
    return this._codeHelpers.current().codeToDisplay();
  },	 
  
  codeToAdd: function() {
    return this._codeHelpers.current().codeToAdd();
  },
  
  executeCodeAt: function(url) {
    if (this.codeToExecute() == '' ) return;
    this._standardOutput.clear();
    url += ("/" + this._codeHelpers._currentIndex);
    executionResult = this._executionResource.post(url, this.codeToExecute(), SYNCHRONOUS);  
    this._standardOutput.updateWith(executionResult);    
  },
  
  executeCode: function() { // Overloader in teacher slideshow (to remove)
    this.executeCodeAt(this._runResource);
  },

  _update: function() {
    this._codeHelpers.update();
    this._serverExecutionContext.updateWithResource(this._updateResource);    
    if (this._serverExecutionContext.isEmpty()) {
      if (this._editor.updateWithLocalExecutionContext()) { this.executeCodeAt(this._runResource); }
    } else {
      if (this._editor.updateWithServerExecutionContext()) { this.executeCodeAt(this._runResource); }
    }
  },
  
};

for(key in Slide.prototype) {
  if (! CodeSlide.prototype[key]) CodeSlide.prototype[key] = Slide.prototype[key];
};
