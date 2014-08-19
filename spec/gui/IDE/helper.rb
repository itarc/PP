def press_space
  find(:css, 'div.presentation').native.send_key(:space)
end

def go_right
  find(:css, 'div.presentation').native.send_key(:arrow_right)
end

def go_left
  find(:css, 'div.presentation').native.send_key(:arrow_left)
end

def go_down
  find(:css, 'div.presentation').native.send_key(:arrow_down)
end

def go_up
  find(:css, 'div.presentation').native.send_key(:arrow_up)
end

def execute
  click_on "execute"
end

def send_code
  click_on "send_code"
end

require_relative '../../../db/Accesseur'  
$db = Accesseur.new

def display_db_content
  puts $db.execute_sql("select * from teacher_current_slide").values
end

def fill_IDE_with(code_input)
  fill_in 'code_input', :with => code_input
end

def expect_IDE_to_have(code_input, code_output)
  expect(page).to have_field 'code_input', :with => code_input
  expect(page).to have_field 'code_output', :with => code_output
end

def expect_IDE_to_be_empty
  expect_IDE_to_have(code_input = '', code_output = '')
end

def expect_AuthorBar_to_have(author, last_send_attendee_name)
  within "#author_name" do
    expect(page.text).to eq author
  end
  within "#last_send_attendee_name", :visible => false do
    expect(page.text).to eq last_send_attendee_name
  end  
end

def expect_sessionID_to_be_empty
  expect_sessionID_to_be('?')
end

def expect_login_page_to_be_empty
  expect_login_page_to_be('')
end

def expect_login_page_to_be(value)
  expect(page).to have_content 'AUTHOR NAME?'  
  expect(page).to have_field 'attendee_name', :with => value
end

def expect_sessionID_to_be(value)
  expect(page).to have_content 'AUTHOR: ' + value
end

def log_attendee_in(name)
  fill_in 'attendee_name', :with => name  
  find('#attendee_name').native.send_key(:return)
end

def teacher_go_to_slide(slide_index)
  $db.execute_sql("update teacher_current_slide set current_slide_id = '#{ slide_index }'") 
end