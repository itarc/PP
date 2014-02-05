describe("Teacher SlideShow : Navigation with Coding Slide", function() {

  it("should not go beyond penultimate slide if last slide is coding slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'></div><div class='slide'><textarea id='code_input'>puts 1</textarea><input type='button' id='execute'/><textarea id='code_output'></textarea></div></div>")
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'))
	  
    expect(teacherSlideShow._currentIndex).toBe(0)	  
	  
    __triggerKeyboardEvent(document, RIGHT_ARROW)
	  
    expect(teacherSlideShow._currentIndex).toBe(0)
	  
  })
  
})
