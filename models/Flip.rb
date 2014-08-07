require_relative '../db/Accesseur'  
$db = Accesseur.new

class Flip

  def initialize(symbol, value)
    @symbol = symbol
    @value = value
  end
  
  def save
    value = $db.execute_sql("select value from flip_values where symbol = '#{ @symbol }'").values[0]
    if value then
      $db.execute_sql("update flip_values set value = '#{ @value }' where symbol = '#{ @symbol }'")
    else
      $db.execute_sql("insert into flip_values values ('#{ @symbol }', '#{ @value }')")      
    end
  end
  
  def value
    @value
  end
  
  def Flip.find(symbol)
    value = $db.execute_sql("select value from flip_values where symbol = '#{ symbol }'").values[0]
    if value then value = value[0] end
    Flip.new(symbol, value)
  end

end