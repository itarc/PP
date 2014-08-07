// ----------------------------------
// COMMON
// ----------------------------------

var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;
var UP_ARROW = 38;
var SPACE = 32;
var HOME = 36;

var BACK_SPACE = 8;

var SYNCHRONOUS = false;
var ASYNCHRONOUS = true;

var ALT = 18
var CTRL = 17
var RETURN = 13
var F5 = 116
var BS = 8
var G = 71
var N = 78
var R = 82
var S = 83

var SEPARATOR = '\n#{SEP}#\n'

var SERVER_PATH = ''

var is_a_number = function(variable) {
    return  variable != '' && !( isNaN(variable) ) ;
};

var queryAll = function(node, query) {
  nodeList = node.querySelectorAll(query);
  return Array.prototype.slice.call(nodeList, 0);
};

var Resource = function() {
};

Resource.prototype = {

  _asynchronousRequestDone: function(xmlhttp) {
    return (xmlhttp.readyState==4 && xmlhttp.status==200)
  },
  
  _xmlhttpResponseText: function(xmlhttp) {
    return xmlhttp.responseText;
  },  
  
  _getResourceWithCallBack: function(xmlhttp, path, object, callback) {
      _t = this;
      xmlhttp.onreadystatechange=function()
      {
        if (_t._asynchronousRequestDone(xmlhttp))
        {
          callback.call(object, _t._xmlhttpResponseText(xmlhttp));
        }
      }
      xmlhttp.open("GET", SERVER_PATH + path, true, callback);
      xmlhttp.send();
  },
  
  get: function(path, synchronous_asynchronous, object, callback) {
    var xmlhttp = new XMLHttpRequest();

    if (synchronous_asynchronous == ASYNCHRONOUS) {  
      this._getResourceWithCallBack(xmlhttp, path, object, callback);
    } else {
      xmlhttp.open("GET", SERVER_PATH + path, false);
      xmlhttp.send();    
      return xmlhttp.responseText;
    }
  },
  
  post: function(path, params, synchronous_asynchronous) {
    var xmlhttp = new XMLHttpRequest();	
    xmlhttp.open("POST", SERVER_PATH + path, synchronous_asynchronous);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send(params);	
    return xmlhttp.responseText;
  },

};

var preventDefaultKeys = function(e) {};


