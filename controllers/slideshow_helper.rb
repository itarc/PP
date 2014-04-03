#encoding:UTF-8

require_relative '../models/Poll'
require_relative '../models/RunTime'

def question_id
  params[:splat][1]
end

def answer
  params[:splat][0]
end

def user_id
  session[:user_id]  
end

def slide_index
  params[:splat][0]
end

def next_user_id
  $db.execute_sql("update compteur set identifiant = identifiant + 1")
  $db.execute_sql("select identifiant from compteur").to_a[0]['identifiant']
end

def current_slide_id
  slide_index = $db.execute_sql("select current_slide_id from teacher_current_slide").to_a[0]
  if (! slide_index) then
    $db.execute_sql("insert into teacher_current_slide values (0)")
  end
  $db.execute_sql("select current_slide_id from teacher_current_slide").to_a[0]['current_slide_id']
end

def update_current_slide_id(current_slide_id)
  if $db.execute_sql("select current_slide_id from teacher_current_slide").to_a[0] then
    $db.execute_sql("update teacher_current_slide set current_slide_id = '#{current_slide_id}'")
  else
    $db.execute_sql("insert into teacher_current_slide values ('#{ current_slide_id }')")
  end
end
