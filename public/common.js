// ----------------------------------
// COMMON
// ----------------------------------

var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;
var UP_ARROW = 38;
var SPACE = 32;
var HOME = 36;

var SYNCHRONOUS = false;
var ASYNCHRONOUS = true;

var ALT = 18
var CTRL = 17
var F5 = 116
var R = 82
var S = 83

var SEPARATOR = '\n#{SEP}#\n'

var is_a_number = function(variable) {
    return  !( isNaN(variable) );
};

var queryAll = function(node, query) {
  nodeList = node.querySelectorAll(query);
  return Array.prototype.slice.call(nodeList, 0);
};

var postResource = function(path, params, synchronous_asynchronous) {
  var xmlhttp = new XMLHttpRequest();	
  xmlhttp.open("POST", path, synchronous_asynchronous);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send(params);	
  return xmlhttp.responseText;
};

var getResource = function(path) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", path, false);
  xmlhttp.send();
  return xmlhttp.responseText;
};

