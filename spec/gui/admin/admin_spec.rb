#encoding: utf-8

require 'rspec'
require 'capybara/rspec'

## -------------------------------------------------------
## SINATRA CONTROLLER (BEGIN)
## -------------------------------------------------------

require_relative '../../../controllers/slideshow.rb'

Capybara.app = Sinatra::Application.new

set :public_folder, 'fixtures'
set :logging, false

flip_admin_page = '/fixture/admin/flip'

get flip_admin_page do
  redirect "flip.html"
end

## -------------------------------------------------------
## SINATRA CONTROLLER (END)
## -------------------------------------------------------

describe 'Feature Flipping Admin page', :type => :feature, :js => true do
	
  before(:each) do
    $db.execute_sql("delete from flip_values") 
  end	
  
  it 'should set/unset feature' do

    visit flip_admin_page

    expect(page).to have_content 'get_position_sync_async'
    
    expect(find('#actual').text).to eq "none"
    expect(page).to have_field 'new', :with => ''
    
    fill_in 'new', :with => 'new_value'
     
    find(:css, '#new').native.send_key(:return)     
     
    expect(find('#actual').text).to eq "new_value"
    expect(page).to have_field 'new', :with => 'new_value'    

    visit flip_admin_page

    expect(find('#actual').text).to eq "new_value"
    expect(page).to have_field 'new', :with => '' 
    
  end
  
  after(:each) do
    $db.execute_sql("delete from flip_values")    
  end  

end