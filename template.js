(function(window){

INDENT_SYMBOL = "\t";

function node(element){
  if (element.nodeName=="#text") return textNode(element);
  var tag = "\""+element.tagName.toLowerCase()+"\"", attributes = null, children = null;
  if (element.attributes.length)  attributes = "{"+_.map(element.attributes, nodeAttribute).join(", ")+"}";
  if (element.childNodes.length) {
    var effective_children = _.chain(element.childNodes).map(node).compact().value();
    if (effective_children.length == 1) children = effective_children[0];
    else if (effective_children.length > 1) children = "r().m(c,"+effective_children.join(", ")+")";
  };
  var body = "e("+[tag].concat(children?[attributes||"null", children]:attributes?[attributes]:[]).join(", ")+")";
  if (element.hasAttribute("g-for") && element.hasAttribute("g-in")) return repeatElement(element, body);
  return body;
};

function textNode(element){
  if (!element.textContent.match(/[^\s]+/)) return null;
  var trimt = element.textContent.trim();
  return "e(\"#text\", "+checkString(trimt)+")";
};

function checkString(string) { return string[0]=="=" ? string.slice(1): "\""+JSON.stringify(string).slice(1,-1)+"\"" };

function nodeAttribute(att){ return "\""+att.name+"\": " + checkListenerString(att.value) };

function checkListenerString(string){ switch (string[0]) {
  case "#": return "function(event){"+string.slice(1)+";event.preventDefault()}";
  default: return checkString(string);
}};

function repeatElement(element, body){
  var list = element.getAttribute("g-in"); element.removeAttribute("g-in");
  var vars = element.getAttribute("g-for"); element.removeAttribute("g-for");
  return "r().m(_.map, "+list+", function("+vars+"){return "+body+"})";
}

var html2dom = function html2dom (fragmentString){
    var fragment = document.createElement("div");
    fragment.innerHTML = fragmentString;
    return fragment;
};

document.currentScript.cog = {
  html2dom: html2dom,
  node: node
}

})(window)