require 'test/unit'
require 'rack/test'

require 'capybara'
require 'capybara/dsl'

require_relative 'controllers.slideshow.rb'

set :logging, false  # stop sinatra+thin logging

class SlideShow_GUITest < Test::Unit::TestCase

  include Capybara::DSL
  Capybara.default_driver = :selenium


  def setup

    Capybara.app = Sinatra::Application.new

  end

  def test01_should_display_first_slide

    visit '/slideshow_fixture_navigation.html'

    assert page.has_content?("SLIDE 1"), page.body
    assert not(page.has_content?("SLIDE 2")), page.body
    
  end

  def test02_should_display_second_slide_after_right_arrow_pressed

    visit '/slideshow_fixture_navigation.html'
    
    find(:css, 'div.presentation').native.send_key(:arrow_right) # does not work with rack-test driver, it woks with selenium
    
    assert not(page.has_content?("SLIDE 1")), page.body
    assert page.has_content?("SLIDE 2"), page.body
 
  end

  def test03_should_go_back_to_first_slide_when_left_arrow_pressed

    visit '/slideshow_fixture_navigation.html'
    
    find(:css, 'div.presentation').native.send_key(:arrow_right) # does not work with rack-test driver, it woks with selenium
    find(:css, 'div.presentation').native.send_key(:arrow_left) # does not work with rack-test driver, it woks with selenium
    
    assert page.has_content?("SLIDE 1"), page.body
    assert not(page.has_content?("SLIDE 2")), page.body

  end

  def test04_should_syncrhronise_and_display_teacher_current_slide_when_spacebar_pressed

    visit '/slideshow_fixture_navigation.html'
    
    find(:css, 'div.presentation').native.send_key(:arrow_right) # does not work with rack-test driver, it woks with selenium
    
    find(:css, 'div.presentation').native.send_key(:space) # does not work with rack-test driver, it woks with selenium
    
    assert not(page.has_content?("SLIDE 1")), page.body
    assert page.has_content?("SLIDE 2"), page.body

  end

end
