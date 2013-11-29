function __triggerKeyboardEvent(element, keyCode)
{

  var eventObj = document.createEvent("Events");
  
  eventObj.initEvent("keydown", true, true);
  eventObj.keyCode = keyCode;
  
  element.dispatchEvent(eventObj);
  
}