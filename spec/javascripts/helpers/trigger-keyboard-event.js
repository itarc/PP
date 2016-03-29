function __triggerKeyboardEvent(element, keyCode, controlKey) /* controlKey : should be false by default */
{

  var eventObj = document.createEvent("Events");
  
  eventObj.initEvent("keydown", true, true);
  eventObj.keyCode = keyCode;
	
  if (controlKey == ALT) { eventObj.altKey = true; eventObj.which = keyCode }
  
  element.dispatchEvent(eventObj);
  
}