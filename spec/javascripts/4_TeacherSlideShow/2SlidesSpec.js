describe("Teacher SlideShow : Navigation with 2 Slides", function() {

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

})
