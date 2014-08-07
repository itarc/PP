var getFlipValue = function(symbol) {
  var flipResource = new Resource();
  
  flipValue = flipResource.get('/admin/flip/' + symbol);
  return  flipValue;
}

var postFlipValue = function(symbol, value) {
  var flipResource = new Resource();

  flipResource.post('/admin/flip/' + symbol, 'value=' + value, SYNCHRONOUS);
}

var getBooleanFlipValue = function(symbol, defaultValue) { 
  booleanFlipValue = getFlipValue(symbol)
  if (booleanFlipValue == 'true') { return  true }
  if (booleanFlipValue == 'false') { return  false }
  return defaultValue;
}

var getNumberFlipValue = function(symbol, defaultValue) { 
  numberFlipValue = getFlipValue(symbol)
  if (is_a_number(numberFlipValue)) { return  parseInt(numberFlipValue) }
  return defaultValue;
}

FLIP_GET_POSITION_SYNC_ASYNC = getBooleanFlipValue('get_position_sync_async', SYNCHRONOUS)
FLIP_ATTENDEE_GET_POSITION_FREQUENCY = getNumberFlipValue('attendee_get_position_frequency', 2000)
