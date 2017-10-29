var Parser = require('./helper/Parser');

var Generator = function(editorUi, fileName, language) {
    this.editorUi = editorUi;
    this.fileName = fileName;
    this.language = language;
    this.classAndInterfaceLists = {}; // key = mxCells id
}

Generator.prototype.generateCode = function() {
    var ui = this.editorUi;
    var editor = ui.editor;
    var fileName = this.fileName;
    var language = this.language;
    var xmlString = mxUtils.getXml(editor.getGraphXml());
    var xml = this.xmlStringToXml(xmlString);

    var parser = new Parser();
    this.classAndInterfaceLists = parser.parseXmlToclassAndInterfaceList(xml);
    console.log(this.classAndInterfaceLists);
    var code = '';
    if (language == 'java') {
        code = this.generateCodeJava();
    }

    console.log(code);
    // If code is generated, prompt download file
    if (code) {
        this.saveCode(fileName, code);
        ui.hideDialog();
    }

}

Generator.prototype.generateCodeJava = function() {
    var list = this.classAndInterfaceLists;
    var str = '';
    for (var key in list) {
        if (list.hasOwnProperty(key)) {
            str += this.generateStringFromClassElement(list[key]);
        }
    }
    return str;
}


/** ============== Generate Class Element String ================================ */
ClassTemplateGenerator = function(className, attributesStr, methodsStr, extendsStr, implementsStr) {
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

InterfaceTemplateGenerator = function(interfaceName, attributesStr, methodsStr) {
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

ClassElementGeneratorFactory = function(element) {
    var attributesStr = Generator.prototype.generateStringAttribute(element);
    var methodsStr = Generator.prototype.generateStringMethod(element);
    var extendsStr = Generator.prototype.generateStringExtends(element);
    var implementsStr = Generator.prototype.generateStringImplements(element);

    if (element.type === 'class') {
         var className = element.className;
         return new ClassTemplateGenerator(className, attributesStr, methodsStr, extendsStr, implementsStr);
    }
    if (element.type === 'interface') {
        var interfaceName = element.interfaceName;
        return new InterfaceTemplateGenerator(interfaceName, attributesStr, methodsStr);
    }
}

Generator.prototype.generateStringFromClassElement = function(element) {
    var attributesStr = this.generateStringAttribute(element);
    var methodsStr = this.generateStringMethod(element);

    var str = ClassElementGeneratorFactory(element).generate();
    return str;
}
/** ============== END Generate Class Element String ================================ */


/** ============== Generate Class Attributes String ================================ */
Generator.prototype.generateStringAttributeTemplate = function(scopeName, attribute) {
    return `    ${scopeName} ${attribute.type} ${attribute.attributeName};\n`
}

Generator.prototype.generateStringAttribute = function(element) {
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
Generator.prototype.generateMethodTemplate = function(methodScopeName, method) {
    return (
`\
    ${methodScopeName} ${method.returnType} ${method.methodName} {
        /* insert code here */
    }

`
    );
}

Generator.prototype.generateStringMethod = function(element) {
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
Generator.prototype.generateStringImplements = function(element) {
    var separator = ',';
    var implements = element.implements;
    console.log(implements);
    if (implements.length) {
        var implementString = implements.join(', ').trim();
        return ` implements ${implementString}`;
    }
    return '';
}
/** ============== END Generate Implements List ===================================== */

/** ============== Generate Extends List ======================================== */

// Java can only extend one class.
// TODO: Throw error if extending more than one class
Generator.prototype.generateStringExtends = function(element) {
    var separator = ',';
    var extendsList = element.extends;
    if (extendsList.length) {
        var extendsString = extendsList[0];
        return ` extends ${extendsString}`;
    }
    return '';
}
/** ============== END Generate Extends List ===================================== */


Generator.prototype.saveCode = function(fileName, code) {
    var data = new Blob([code], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (code !== null) {
      window.URL.revokeObjectURL(code);
    }

    code = window.URL.createObjectURL(data);

    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link); // Firefox requires the link to be in the body
        link.download = fileName;
        link.href = code;
        link.click();
        document.body.removeChild(link); // remove the link when done
    } else {
        location.replace(uri);
    }
}

Generator.prototype.xmlStringToXml = function(xmlString) {
    // get the function to parse xmlStr to xml
    var parseXml;

    if (window.DOMParser) {
        parseXml = function(xmlStr) {
            return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
        };
    } else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) {
        parseXml = function(xmlStr) {
            var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlStr);
            return xmlDoc;
        };
    } else {
        parseXml = function() { return null; }
    }

    return parseXml(xmlString);
}

module.exports = Generator;