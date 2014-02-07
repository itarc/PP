describe("TeacherSlideShow Navigation with 1 Slide", function() {

  it("should have one current slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'></div></div>");
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'));

    expect(teacherSlideShow._slides.length).toBe(1);	  
    expect(teacherSlideShow._slides[0] instanceof Slide).toBe(true);

    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current');
    expect(teacherSlideShow._currentIndex).toBe(0);

  });
  
   it("should init server with currentIndex when teacher slideshow is intialized", function() {

    spyOn(TeacherSlideShow.prototype, '_postCurrentIndexOnServer');

    var teacherSlideShow = new TeacherSlideShow([]);

    expect(TeacherSlideShow.prototype._postCurrentIndexOnServer).toHaveBeenCalled();
    expect(TeacherSlideShow.prototype._postCurrentIndexOnServer.call.length).toBe(1);

  });
  
});

describe("TeacherSlideShow Navigation with 2 Slides", function() {

  it("should open on first slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'))

    expect(teacherSlideShow._slides.length).toBe(2);	  
    expect(teacherSlideShow._slides[0] instanceof Slide).toBe(true)
    expect(teacherSlideShow._slides[1] instanceof Slide).toBe(true)

    expect(teacherSlideShow._currentIndex).toBe(0)	  

    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')

  });  
  
  it("should go to second slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
	  
    expect(teacherSlideShow._currentIndex).toBe(1)	  
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide current')

  });    
  
  it("should go to second slide and go back to first slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, LEFT_ARROW)
	  
    expect(teacherSlideShow._currentIndex).toBe(0)	  
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')

  });   

});

describe("TeacherSlideShow Navigation with 3 Slides", function() {

  it("should open on first slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'))
	  
    expect(teacherSlideShow._slides.length).toBe(3);	  

    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')	  
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide')	  
	  
  })
  
  it("should go to second slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide')	  

  }); 

  it("should go to third slide", function() {

    setFixtures("<div class='slides'><div class='slide'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, RIGHT_ARROW)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide current')	  
    
  });   

  it("should go back to second slide", function() {

    setFixtures("<div class='slides'><div class='slide'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, LEFT_ARROW)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide')		  
    
  }); 
  
  it("should go back to first slide", function() {

    setFixtures("<div class='slides'><div class='slide'><div class='slide'><div class='slide'></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'))

    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, RIGHT_ARROW)
    __triggerKeyboardEvent(document, LEFT_ARROW)
    __triggerKeyboardEvent(document, LEFT_ARROW)
	  
    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current')
    expect(teacherSlideShow._slides[1]._node.className).toBe('slide')
    expect(teacherSlideShow._slides[2]._node.className).toBe('slide')	  
    
  })
  
});

describe("TeacherSlideShow Navigation With a Coding Slide At The End", function() {

  it("should not go beyond penultimate slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'></div><div class='slide'><textarea id='code_input'>puts 1</textarea><input type='button' id='execute'/><textarea id='code_output'></textarea></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'))
	  
    expect(teacherSlideShow._currentIndex).toBe(0)	  
	  
    __triggerKeyboardEvent(document, RIGHT_ARROW)
	  
    expect(teacherSlideShow._currentIndex).toBe(0)
	  
  })
  
});


