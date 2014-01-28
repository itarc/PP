describe("Teacher SlideShow : Navigation with 1 Slide", function() {

  it("should have one current slide", function() {
	  
    setFixtures("<div class='slides'><div class='slide'></div></div>");
    var teacherSlideShow = new TeacherSlideShow(queryAll('.slide'));

    expect(teacherSlideShow._slides.length).toBe(1);	  
    expect(teacherSlideShow._slides[0] instanceof Slide).toBe(true);

    expect(teacherSlideShow._slides[0]._node.className).toBe('slide current');
    expect(teacherSlideShow._currentIndex).toBe(0);

  });
  
   it("should init server with currentIndex when teacher slideshow is intialized", function() {

    spyOn(TeacherSlideShow.prototype, '_postCurrentIndex');

    var teacherSlideShow = new TeacherSlideShow([]);

    expect(TeacherSlideShow.prototype._postCurrentIndex).toHaveBeenCalled();
    expect(TeacherSlideShow.prototype._postCurrentIndex.call.length).toBe(1);

  });  
  
});
