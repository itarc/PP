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
  within "#last_send_attendee_name" do
    expect(page.text).to eq last_send_attendee_name
  end  
end