var Handler = require('../Handler');

var ClassOrInterfaceStrategy = function() {};
ClassOrInterfaceStrategy.prototype = new Handler();
ClassOrInterfaceStrategy.prototype.handleRequest = function(parser, mxCell, componentName) {
  if (componentName === 'class' || componentName === 'interface') {
    return parser.generateAndPushClassOrInterfaceElement(mxCell, componentName);
  }
  return this.next.handleRequest(parser, mxCell, componentName);
}

var AttributeStrategy = function() {};
AttributeStrategy.prototype = new Handler();
AttributeStrategy.prototype.handleRequest = function(parser, mxCell, componentName) {
  if (componentName === 'attribute') {
    return parser.pushAttribute(mxCell);
  }
  return this.next.handleRequest(parser, mxCell, componentName);
}

var MethodStrategy = function() {};
MethodStrategy.prototype = new Handler();
MethodStrategy.prototype.handleRequest = function(parser, mxCell, componentName) {
  if (componentName === 'method') {
    return parser.pushMethod(mxCell);
  }
  return this.next.handleRequest(parser, mxCell, componentName);
}

var GeneralizationStrategy = function() {};
GeneralizationStrategy.prototype = new Handler();
GeneralizationStrategy.prototype.handleRequest = function(parser, mxCell, componentName) {
  if (componentName === 'generalization') {
    console.log('mulai susah wkwkwkwk');
    return;
    // return parser.pushGeneralization(mxCell);
  }
  return this.next.handleRequest(parser, mxCell, componentName);
}

var exports = {};
exports.ClassOrInterfaceStrategy = ClassOrInterfaceStrategy;
exports.AttributeStrategy = AttributeStrategy;
exports.MethodStrategy = MethodStrategy;
exports.GeneralizationStrategy = GeneralizationStrategy;

module.exports = exports;