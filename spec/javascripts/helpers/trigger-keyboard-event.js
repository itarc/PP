function __triggerKeyboardEvent(element, keyCode, alt = false)
{

  var eventObj = document.createEvent("Events");
  
  eventObj.initEvent("keydown", true, true);
  eventObj.keyCode = keyCode;
	
  if (alt) { eventObj.altKey = true; eventObj.which = keyCode }
  
  element.dispatchEvent(eventObj);
  
}