#encoding:UTF-8

require_relative '../models/Poll'
require_relative '../models/RunTime'
require_relative '../models/Statistics'

def question_id
  params[:splat][1]
end

def answer
  params[:splat][0]
end

def user_id
  session[:user_id]  
end

def next_id
  $db.execute_sql("update compteur set identifiant = identifiant + 1")
  return $db.execute_sql("select identifiant from compteur").to_a[0]['identifiant'].to_i
end

def current_slide_id
  $db.execute_sql("select current_slide_id from teacher_current_slide").to_a[0]['current_slide_id'].to_s
end

def update_current_slide_id(current_slide_id)
   $db.execute_sql("update teacher_current_slide set current_slide_id = '#{current_slide_id}'")
end
