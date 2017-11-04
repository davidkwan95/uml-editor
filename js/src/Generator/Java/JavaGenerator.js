var AbstractGenerator = require('../AbstractGenerator');

var JavaGenerator = function(editorUi, fileName) {
  AbstractGenerator.call(this, editorUi, fileName);
};
JavaGenerator.prototype = new AbstractGenerator();

JavaGenerator.prototype.generateCode = function(classAndInterfaceLists) {
  var list = classAndInterfaceLists;

  var str = '';
  for (var key in list) {
      if (list.hasOwnProperty(key)) {
          str += this.generateStringFromClassElement(list[key]);
      }
  }
  return str;
}

/** ============== Generate Class Element String ================================ */
const ClassTemplateGenerator = function(className, attributesStr, methodsStr, extendsStr, implementsStr) {
  this.className = className;
  this.attributesStr = attributesStr;
  this.methodsStr = methodsStr;
  this.extendsStr = extendsStr;
  this.implementsStr = implementsStr;
  this.generate = function() {
      return (
`\
class ${this.className}${this.extendsStr}${this.implementsStr} {
${this.attributesStr}
${this.methodsStr}
}

`
      );
  }
}

const InterfaceTemplateGenerator = function(interfaceName, attributesStr, methodsStr) {
  this.interfaceName = interfaceName;
  this.attributesStr = attributesStr;
  this.methodsStr = methodsStr;
  this.generate = function() {
      return (
`\
interface ${this.interfaceName} {
${this.attributesStr}
${this.methodsStr}
}

`
      );
  }
}

const ClassElementGeneratorFactory = function(element) {
  var attributesStr = JavaGenerator.prototype.generateStringAttribute(element);
  var methodsStr = JavaGenerator.prototype.generateStringMethod(element);
  var extendsStr = JavaGenerator.prototype.generateStringExtends(element);
  var implementsStr = JavaGenerator.prototype.generateStringImplements(element);

  if (element.type === 'class') {
       var className = element.className;
       return new ClassTemplateGenerator(className, attributesStr, methodsStr, extendsStr, implementsStr);
  }
  if (element.type === 'interface') {
      var interfaceName = element.interfaceName;
      return new InterfaceTemplateGenerator(interfaceName, attributesStr, methodsStr);
  }
}

JavaGenerator.prototype.generateStringFromClassElement = function(element) {
  var attributesStr = this.generateStringAttribute(element);
  var methodsStr = this.generateStringMethod(element);

  var str = ClassElementGeneratorFactory(element).generate();
  return str;
}
/** ============== END Generate Class Element String ================================ */


/** ============== Generate Class Attributes String ================================ */
JavaGenerator.prototype.generateStringAttributeTemplate = function(scopeName, attribute) {
  return `    ${scopeName} ${attribute.type} ${attribute.attributeName};\n`
}

JavaGenerator.prototype.generateStringAttribute = function(element) {
  var attributesStr = '';

  for (var i = 0; i < element.privateAttributes.length; i++) {
      var attribute = element.privateAttributes[i];
      attributesStr += this.generateStringAttributeTemplate('private', attribute);
  }
  for (var i = 0; i < element.publicAttributes.length; i++) {
      var attribute = element.publicAttributes[i];
      attributesStr += this.generateStringAttributeTemplate('public', attribute);
  }
  for (var i = 0; i < element.protectedAttributes.length; i++) {
      var attribute = element.protectedAttributes[i];
      attributesStr += this.generateStringAttributeTemplate('protected', attribute);
  }

  return attributesStr;
}
/** ============== END Generate Class Attributes String ================================ */


/** ============== Generate Class Method String ================================ */
JavaGenerator.prototype.generateMethodTemplate = function(methodScopeName, method) {
  return (
`\
    ${methodScopeName} ${method.returnType} ${method.methodName} {
      /* insert code here */
    }

`
  );
}

JavaGenerator.prototype.generateStringMethod = function(element) {
  var methodsStr = '';

  for (var i = 0; i < element.privateMethods.length; i++) {
      var method = element.privateMethods[i];
      methodsStr += this.generateMethodTemplate('private', method);
  }

  for (var i = 0; i < element.publicMethods.length; i++) {
      var method = element.publicMethods[i];
      methodsStr += this.generateMethodTemplate('public', method);
  }

  for (var i = 0; i < element.protectedMethods.length; i++) {
      var method = element.protectedMethods[i];
      methodsStr += this.generateMethodTemplate('protected', method);
  }

  return methodsStr;
}
/** ============== END Generate Class Method String ================================ */

/** ============== Generate Implements List ======================================== */
JavaGenerator.prototype.generateStringImplements = function(element) {
  var separator = ',';
  var implementsList = element.implements;
  if (implementsList.length) {
      var implementString = implementsList.join(', ').trim();
      return ` implements ${implementString}`;
  }
  return '';
}
/** ============== END Generate Implements List ===================================== */

/** ============== Generate Extends List ======================================== */

// Java can only extend one class.
// TODO: Throw error if extending more than one class
JavaGenerator.prototype.generateStringExtends = function(element) {
  var separator = ',';
  var extendsList = element.extends;
  if (extendsList.length) {
      var extendsString = extendsList[0];
      return ` extends ${extendsString}`;
  }
  return '';
}
/** ============== END Generate Extends List ===================================== */

module.exports = JavaGenerator;
