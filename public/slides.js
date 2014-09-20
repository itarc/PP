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
  this.type = '';
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
    contextString = this._executionContextResource.get(url)
    if (contextString) return JSON.parse(contextString);
  },
  
  updateWithResource: function(resourceURL) {
    newServerExecutionContext = this.getContextOnServer(resourceURL + '/' + this._slide._codeHelpers._currentIndex);   
    this.author = (newServerExecutionContext.author) ? newServerExecutionContext.author : '';
    this.type = (newServerExecutionContext.type) ? newServerExecutionContext.type : '';
    this.code = (newServerExecutionContext.code) ? newServerExecutionContext.code : '';
    if (this.code != '') {
      code_split = this.code.split(SEPARATOR);
      this.code = code_split[0]
      this.code_to_add = (code_split[1]) ? code_split[1] : '';
    } else {
      this.code_to_add = '';
    }
  },

}


// ----------------------------------
// SERVER EXECUTION CONTEXT
// ----------------------------------
var LocalExecutionContext = function(slide) {
  this._slide = slide;
  this._saveURL = "/code_save_execution_context";
  this._saveResource = new Resource(); 
}

LocalExecutionContext.prototype = {

  _save: function(type) { 
    this._saveResource.post(this._saveURL + "/" + this._slide._codeHelpers._currentIndex, 
    JSON.stringify({
      "type": type,
      "code": this._slide.codeToExecute(),
      "code_output": this._slide._standardOutput.content()
    }), SYNCHRONOUS);
  }, 

  save: function() { 
    this._save("run");
  },  

  sendToBlackboard: function() { 
    this._save("send");
  },

}

// ----------------------------------
// SESSION
// ----------------------------------
var Session = function() {
  this.UNKNOWN_USER_NAME = '?';
  this.userName = this.UNKNOWN_USER_NAME;

  this._sessionResource = new Resource();  
}

Session.prototype = {
  setUserName: function(userName) {
    this._sessionResource.post('session_id/user_name', 'user_name=' + userName, SYNCHRONOUS);
    this.userName = userName;
  },
  getUserName: function() {
    this.userName = this._sessionResource.get('/session_id/user_name');
    if (this.userName == '') this.userName = this.UNKNOWN_USER_NAME;
    return this.userName;
  },
  userNameIsUnknown: function() {
    return this.userName == this.UNKNOWN_USER_NAME;
  },  
}

// ----------------------------------
// AUTHOR BAR
// ----------------------------------
var AuthorBar = function(node, slide) {
  this._slide = slide;
  this._node = node;

  if (this._node) this.authorNode = this._node.querySelector('#author_name');
  if (this._node) this.lastsendNode = this._node.querySelector('#last_send_attendee_name');
  
  this.updateAuthorNameWith(this._slide._session.getUserName());
}

AuthorBar.prototype = {
  
  updateAuthorNameWith: function(userName) {
    if (! this.authorNode) return;
    this.userName = userName;
    this.authorNode.innerHTML = this.userName;
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
  this._authorBar = new AuthorBar(slide._node.querySelector('.code_author'), this._slide);  
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
    return true
  },
  
  update: function() {
    if (this._slide._serverExecutionContext.isEmpty()) {
      return this.updateWithLocalExecutionContext();
    } else {
      return this.updateWithServerExecutionContext();
    }    
  }
  
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
    this._currentIndex = (this._slide._session.userNameIsUnknown()) ? 0 : this._slide._slideshow._currentIndex;
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
  this._session = new Session();
  this._serverExecutionContext = new ServerExecutionContext(this);
  this._localContext = new LocalExecutionContext(this);
  this._editor = new Editor(this._node.querySelector('#code_input'), this);
  this._standardOutput = new StandardOutput(this._node.querySelector('#code_output'));
  this._codeHelpers = new CodeHelpers(queryAll(node, '.code_helper'), this);   
  
  this._runResource = '/code_run_result';
  this._getAndRunResource = '/code_get_last_send_to_blackboard';
  this._updateResource = '/code_last_execution';
  
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
  },
  
  _declareEvents: function() {  
    var _t = this;   
    if (_t._node.querySelector('#attendee_name')) {
    this._node.querySelector('#attendee_name').addEventListener('keydown',
      function(e) { 
        if (e.keyCode == RETURN) {
          if (this.value == '') return;
          _t._session.setUserName(this.value);
          _t._editor._authorBar.updateAuthorNameWith(_t._session.userName); 
          this.value = '';
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
      function(e) { _t.run(); }, false
    );     
    this._node.querySelector('#send_code').addEventListener('click',
      function(e) { _t.runAndSend(); }, false
    );     
    this._node.querySelector('#get_code').addEventListener('click',
      function(e) { _t.getAndRun(); }, false
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

  _runResult: function() {
    return this._executionResource.post(this._runResource, this.codeToExecute(), SYNCHRONOUS);
  },

  getAndRun: function() {
    this._serverExecutionContext.updateWithResource(this._getAndRunResource); 
    if (this._editor.updateWithServerExecutionContext()) { 
      this.run();
    }
  },  

  runAndSend: function() {
    if (this.codeToExecute() == '' ) return; 
    this._standardOutput.clear();
    this._standardOutput.updateWith(this._runResult());     
    this._localContext.sendToBlackboard();
  },  

  run: function() { // Overloader in teacher slideshow (try to remove from it)
    if (this.codeToExecute() == '' ) return;
    this._standardOutput.clear();
    this._standardOutput.updateWith(this._runResult());
    this._localContext.save();
  },

  _update: function() {
    this._codeHelpers.update();
    this._serverExecutionContext.updateWithResource(this._updateResource); 
    if (this._editor.update()) { this.run(); }
  },
  
};

for(key in Slide.prototype) {
  if (! CodeSlide.prototype[key]) CodeSlide.prototype[key] = Slide.prototype[key];
};
