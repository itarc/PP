require 'test/unit'
require 'rack/test'

require 'capybara'
require 'capybara/dsl'

require_relative 'controllers.slideshow.rb'

set :logging, false

class SlideShow_GUITest < Test::Unit::TestCase

  include Capybara::DSL
  Capybara.default_driver = :selenium

  def setup

    Capybara.app = Sinatra::Application.new

  end

  def test01_should_display_the_poll

    visit '/slideshow_fixture_poll.html'

    assert page.has_content?("POLL"), page.body
    assert page.has_content?("QUESTION"), page.body
    assert page.has_content?("ANSWER_1"), page.body
    assert page.has_content?("ANSWER_2"), page.body
    
  end

  def test02_should_display_the_poll_result_when_answer_1_choosen

    visit '/slideshow_fixture_poll.html'

    choose("ANSWER_1")
    find(:css, 'div.presentation').native.send_key(:arrow_right)

    assert page.has_content?("POLL RESULT"), page.body
    assert page.has_content?("QUESTION"), page.body
    assert page.has_content?("ANSWER_1 (100%)"), "Should find - ANSWER_1 (100%)\n" + page.body
    assert page.has_content?("ANSWER_2 (0%)"), "Should find - ANSWER (0%)\n" + page.body
    
  end

  def test03_should_display_the_poll_result_when_answer_2_choosen

    visit '/slideshow_fixture_poll.html'

    #~ choose("ANSWER_2") 
    # does not work with xvfb because window is not maximized so the radio button is not visibie : 
    # one solution is to maximize the window before each test "Capybara.current_session.driver.browser.manage.window.resize_to(width, height)" 
    # or to use page.find(*args).click
    page.find("label", :text => "ANSWER_2").click
    #~ page.find("#label_2").click
    find(:css, "div.presentation").native.send_key(:arrow_right)

    assert page.has_content?("POLL RESULT"), page.body
    assert page.has_content?("QUESTION"), page.body
    assert page.has_content?("ANSWER_1 (0%)"), "Should find - ANSWER_1 (0%)\n" + page.body
    assert page.has_content?("ANSWER_2 (100%)"), "Should find - ANSWER (100%)\n" + page.body
    
  end

end
