// ----------------------------------
// TEACHER POLL SLIDE / EXTENDS CODE SLIDE
// ----------------------------------
var TeacherPollSlide = function(node, slideshow) {
  PollSlide.call(this, node, slideshow);
};

TeacherPollSlide.prototype = {
};

for(key in PollSlide.prototype) {
  if (! TeacherPollSlide.prototype[key]) { TeacherPollSlide.prototype[key] = PollSlide.prototype[key]; };
};

// ----------------------------------
// TEACHER CODE SLIDE / EXTENDS CODE SLIDE
// ----------------------------------
var TeacherCodeSlide = function(node, slideshow) {
  CodeSlide.call(this, node, slideshow);

  this._runResource = '/code_run_result';
  this._sendResource = '/code_send_result';
  this._getAndRunResource = '';
  this._updateResource = '/code_last_execution';
  
  this._attendeesLastSendResource = '/code_attendees_last_send';
};

TeacherCodeSlide.prototype = {

  _keyHandling: function(e) {
    if ( e.altKey ) { 
      if (e.which == N) { this._node.querySelector('#get_last_send').click();}
    } else {
      e.stopPropagation()
    }     
    CodeSlide.prototype._keyHandling.call(this);    
  }, 
  
  _declareEvents: function() {
    CodeSlide.prototype._declareEvents.call(this);
    var _t = this; 
    this._node.querySelector('#get_last_send').addEventListener('click',
      function(e) { _t._updateEditorWithLastSendAndExecute() }, false
    );
  },
  
  executeCode: function() {
    CodeSlide.prototype.executeCode.call(this);
    this._authorBar.refreshWithSessionID();
  },  
  
  _updateEditorWithLastSendAndExecute: function() {
    this.getExecutionContextAtAndExecuteCodeAt(this._attendeesLastSendResource, this._sendResource);
  },  
  
 _updateLastSendAttendeeName: function(slide_index) {
    this._serverExecutionContext.updateWithResource(this._attendeesLastSendResource);
    this._authorBar.updateLastSendAttendeeNameWith(this._serverExecutionContext.author);
  },  
  
  _update: function(slide_index) {
    CodeSlide.prototype._update.call(this, slide_index);
    this._updateLastSendAttendeeName();    
  }
  
};

for(key in CodeSlide.prototype) {
  if (! TeacherCodeSlide.prototype[key]) { TeacherCodeSlide.prototype[key] = CodeSlide.prototype[key]; };
};

// ----------------------------------
// TEACHER SLIDESHOW CLASS / EXTENDS SLIDESHOW
// ----------------------------------
var TeacherSlideShow = function(slides) {
  //~ SlideShow.call(this, slides);  // SUPER CONSTRUCTOR NOT CALLED
  
  var _t = this;
  this._slides = (slides).map(function(element) { 
	  if (element.querySelector('#execute') != null) { return new TeacherCodeSlide(element, _t); };
	  if (element.querySelector('.poll_response_rate') != null) { return new TeacherPollSlide(element, _t); };
    return new Slide(element, _t); 
  });

  document.addEventListener('keydown', function(e) { _t.handleKeys(e); }, false );
  
  this._numberOfSlides = this._slides.length;
  this._currentSlide = this._slides[0];  
  this.position = new Position();

  this._refreshPosition();
  this._showCurrentSlide();  
  
  this.slideShowType = 'teacher';  
  this._runResource = '/code_run_result'; 
  this._sendResource = '/code_send_result'
  this._updateResource = '/code_last_execution'  
  this.position.postCurrentIndex();
  this._updateCurrentSlide();  
};

TeacherSlideShow.prototype = {
  
  _refresh: function() {
    this._last_slide()._updateLastSendAttendeeName();
  },  
  
  handleKeys: function(e) {
    
    SlideShow.prototype.handleKeys.call(this, e);
    
    switch (e.keyCode) {
      case LEFT_ARROW: 
        this.prev(); 
      break;
      case RIGHT_ARROW:  
        this.next(); 
      break;
      case DOWN_ARROW:
        this.down();
      break;
      case UP_ARROW:
        this.up();
      break;	    
      case SPACE:
        this._refreshPosition();       
        this._showCurrentSlide(); 
        this._updateCurrentSlide(); 
      break;	
      case HOME:  
        this.position._currentIndex = 0;
        this._showCurrentSlide();
        this._updateCurrentSlide();
        this.position.postCurrentIndex();      
      break;		    
    }
  },	
};

for(key in SlideShow.prototype) {
  if (! TeacherSlideShow.prototype[key]) TeacherSlideShow.prototype[key] = SlideShow.prototype[key];
};

// ----------------------------------
// INITIALIZE SLIDESHOW
// ----------------------------------  
var teacherSlideshow = new TeacherSlideShow(queryAll(document, '.slide'));
var slideshowTimer = setInterval( function(){ teacherSlideshow._refresh(); },2000);
