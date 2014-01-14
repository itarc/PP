describe("Teacher SlideShow : Navigation with 1 Slide", function() {

  it("should have one current slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'></div></div>");
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'));

    expect(teacherSlideShow._slides.length).toBe(1);	  
    expect(teacherSlideShow._slides[0] instanceof Slide).toBe(true);

    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current');
    expect(teacherSlideShow._currentIndex).toBe(0);

  });

  it("should call code execution when ALT-R", function() {

    setFixtures("<div class='slides'><div class='slide'/><section><textarea id='code_input'>puts 1</textarea><textarea id='code_output'></textarea></section><div class='slide'/></div>");
    spyOn(Slide.prototype, 'executeCode');
	  
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'));

    __triggerKeyboardEvent(document, R, ALT);
	  
    expect(Slide.prototype.executeCode).toHaveBeenCalled();

  });    
  
});
