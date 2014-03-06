function __triggerKeyboardEvent(element, keyCode, controlKey = false)
{

  var eventObj = document.createEvent("Events");
  
  eventObj.initEvent("keydown", true, true);
  eventObj.keyCode = keyCode;
	
  if (controlKey == ALT) { eventObj.altKey = true; eventObj.which = keyCode }
  
  element.dispatchEvent(eventObj);
  
}