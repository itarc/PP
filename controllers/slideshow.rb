require 'sinatra'

set :public_folder, 'public'
set :views, 'views'
set :logging, false

set :bind, '0.0.0.0'
set :show_exceptions, false

enable :sessions; set :session_secret, 'secret'
# The code above does not seem to work with chrome (session disappears)
# We can replace it with this one :
# use Rack::Session::Cookie, :key => 'rack.session',
#                            :path => '/',
#                            :secret => 'secret'

require_relative 'slideshow_helper'

require_relative "slideshow-login"
require_relative "slideshow-polls"
require_relative "slideshow-code"
require_relative "slideshow-admin"
require_relative "slideshow-current_slide"