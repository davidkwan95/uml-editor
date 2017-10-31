var strategies = require('./strategies');

var ClassOrInterfaceStrategy = strategies.ClassOrInterfaceStrategy;
var AttributeStrategy = strategies.AttributeStrategy;
var MethodStrategy = strategies.MethodStrategy;
var GeneralizationStrategy = strategies.GeneralizationStrategy;

var Parser = function () {
  this.elements = {};
  this.classAndInterfaceLists = {};
  this.generalizationList = [];
};

Parser.prototype.parseXmlToclassAndInterfaceList = function (xml) {
  var parser = this;

  var mxCells = xml.getElementsByTagName('mxCell');

  // Remove the first 2 because they are the canvas elements
  for (var id = 2; id < mxCells.length; id++) {
    var mxCell = mxCells[id];
    var componentName = parser.getComponentNameFromCell(mxCell);
    if (componentName) {
      this.doAction(mxCell, componentName);
      this.elements[id] = mxCell;
    }
  }

  // normalize the generalizationLists
  this.generalizationList = this.generalizationList.map(function (el) {
    var newSource = parser.getAttributeOrMethodParent(el.source);
    var newTarget = parser.getAttributeOrMethodParent(el.target);

    return { source: newSource, target: newTarget };
  });

  // merge the generalizationLists to classAndInterfaceLists
  for (id in this.generalizationList) {
    var element = this.generalizationList[id];
    var targetCell = this.elements[element.target];
    var targetCellId = targetCell.getAttribute('id');
    var targetComponentName = this.getComponentNameFromCell(targetCell);

    if (targetComponentName === 'class') {
      var targetClassName = this.classAndInterfaceLists[targetCellId].className;
      this.classAndInterfaceLists[element.source].extends.push(targetClassName);
    } else if (targetComponentName === 'interface') {
      var targetInterfaceName = this.classAndInterfaceLists[targetCellId].interfaceName;
      this.classAndInterfaceLists[element.source].implements.push(targetInterfaceName);
    }
  }

  return this.classAndInterfaceLists;
};

/** CHAIN OF RESPONSIBILITY PATTERN */
Parser.prototype.doAction = function (mxCell, componentName) {
  var parser = this;

  var parseStrategyPipeline = {
    handleRequest(parser, mxCell, componentName) {
      var classOrInterfaceStrategy = new ClassOrInterfaceStrategy();
      var attributeStrategy = new AttributeStrategy();
      var methodStrategy = new MethodStrategy();
      var generalizationStrategy = new GeneralizationStrategy();

      classOrInterfaceStrategy
        .setNext(attributeStrategy)
        .setNext(methodStrategy)
        .setNext(generalizationStrategy);

      classOrInterfaceStrategy.handleRequest(parser, mxCell, componentName);
    }
  };

  parseStrategyPipeline.handleRequest(parser, mxCell, componentName);
};

Parser.prototype.generateAndPushClassOrInterfaceElement = function (mxCell, componentName) {
  var initialState = {
    privateAttributes: [],
    publicAttributes: [],
    protectedAttributes: [],
    privateMethods: [],
    publicMethods: [],
    protectedMethods: [],
    implements: [],
    extends: [],
  };

  var generateElement = function (mxCell, componentName) {
    if (componentName === 'class') {
      return Object.assign({
        type: 'class',
        className: mxCell.getAttribute('value'),
      }, initialState);
    } else if (componentName === 'interface') {
      return Object.assign({
        type: 'interface',
        interfaceName: mxCell.getAttribute('value').split(' ')[1],
      }, initialState);
    }
  };

  var id = mxCell.getAttribute('id');
  this.classAndInterfaceLists[id] = generateElement(mxCell, componentName);
};

Parser.prototype.pushAttribute = function (mxCell) {
  var value = mxCell.getAttribute('value');
  var parent = mxCell.getAttribute('parent');
  var parts = value.split(' ');
  var accessibility = parts[0];
  var attribute = {
    attributeName: parts[1].slice(0, -1),
    type: parts[2],
  };
  if (accessibility === '+') {
    this.classAndInterfaceLists[parent].publicAttributes.push(attribute);
  } else if (accessibility === '-') {
    this.classAndInterfaceLists[parent].privateAttributes.push(attribute);
  } else if (accessibility === '#') {
    this.classAndInterfaceLists[parent].protectedAttributes.push(attribute);
  }
};

Parser.prototype.pushMethod = function (mxCell) {
  var value = mxCell.getAttribute('value');
  var parent = mxCell.getAttribute('parent');
  var parts = value.split(' ');
  var accessibility = parts[0];
  var method = {
    methodName: parts[1].slice(0, -1),
    returnType: parts[2],
  };
  if (accessibility === '+') {
    this.classAndInterfaceLists[parent].publicMethods.push(method);
  } else if (accessibility === '-') {
    this.classAndInterfaceLists[parent].privateMethods.push(method);
  } else if (accessibility === '#') {
    this.classAndInterfaceLists[parent].protectedMethods.push(method);
  }
};

Parser.prototype.pushGeneralization = function (mxCell) {
  var source = mxCell.getAttribute('source');
  var target = mxCell.getAttribute('target');
  this.generalizationList.push({ source: source, target: target });
};

/** Most of the time, the generalization arrow is gonna connect to an attribute
 * or method. If it happens, we are gonna change it to the parent
 */
Parser.prototype.getAttributeOrMethodParent = function (elementId) {
  var mxCell = this.elements[elementId];
  var parentId = mxCell.getAttribute('parent');

  // parentId == 1 is the root. if it is 1, it means it is not class/interface
  // else, we return the parentId;
  if (parentId === '1') {
    return elementId;
  }
  return parentId;
};

Parser.prototype.getComponentNameFromStyle = function (style) {
  var elements = style.split(';');
  var index = -1;
  for (var i = 0; i < elements.length && index === -1; i++) {
    if (elements[i].indexOf('componentName') >= 0) {
      index = i;
    }
  }
  var componentName = null;
  if (index >= 0) {
    componentName = elements[index].split('=')[1];
  }
  return componentName;
};

Parser.prototype.getComponentNameFromCell = function (mxCell) {
  var style = mxCell.getAttribute('style');
  return this.getComponentNameFromStyle(style);
};

module.exports = Parser;