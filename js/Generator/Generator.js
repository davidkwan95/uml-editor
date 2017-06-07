Generator = function(editorUi, fileName, language) {
    this.editorUi = editorUi;
    this.fileName = fileName;
    this.language = language;
    this.classAndInterfaceLists = {}; // key = mxCells id
}

Generator.prototype.generateCode = function() {
    var editor = this.editorUi.editor;
    var fileName = this.fileName;
    var language = this.language;
    var xmlString = mxUtils.getXml(editor.getGraphXml());
    var xml = this.xmlStringToXml(xmlString);

    this.parseXmlToclassAndInterfaceList(xml);
    console.log(this.classAndInterfaceLists);
    var code = '';
    if (language == 'java')
    {
        code = this.generateCodeJava();
    }

    console.log(code);
    // If code is generated, prompt download file
    if (code) {
        this.saveCode(fileName, code);
        editorUi.hideDialog();
    }

}

Generator.prototype.generateCodeJava = function() {
    var list = this.classAndInterfaceLists;
    var str = '';
    for (var key in list) {
        if (list.hasOwnProperty(key)) {
            str += this.generateStringFromClassElement(list[key]);
            str += '\n\n';
        }
    }
    return str;
}

Generator.prototype.generateStringFromClassElement = function(element) {
    var attributesStr = this.generateStringAttribute(element);
    var methodsStr = this.generateStringMethod(element);

    var str = '';
    if (element.type === 'class') {
        var className = element.className;

        str += 
`\
class ${className} {
${attributesStr}
${methodsStr}
}\
`;
    }
    else if (element.type === 'interface') {
        var interfaceName = element.interfaceName;
        str += `interface ${interfaceName} {\n${attributesStr}\n${methodsStr}\n}\n`;
    }
    return str;
}

Generator.prototype.generateStringAttribute = function(element) {
    var attributesStr = '';

    for (var i = 0; i < element.privateAttributes.length; i++) {
        var attribute = element.privateAttributes[i];
        attributesStr += `  private ${attribute.type} ${attribute.attributeName}\n`;
    }
    for (var i = 0; i < element.publicAttributes.length; i++) {
        var attribute = element.publicAttributes[i];
        attributesStr += `  public ${attribute.type} ${attribute.attributeName}\n`;
    }
    for (var i = 0; i < element.protectedAttributes.length; i++) {
        var attribute = element.protectedAttributes[i];
        attributesStr += `  protected ${attribute.type} ${attribute.attributeName}\n`;
    }

    return attributesStr;
}

Generator.prototype.generateStringMethod = function(element) {
    var methodsStr = '';

// ================== TEMPLATE FOR PRIVATE METHODS =============================
    for (var i = 0; i < element.privateMethods.length; i++) {
        var method = element.privateMethods[i];
        methodsStr += 
`\
    private ${method.returnType} ${method.methodName} {
        /* insert code here */
    }

`
    }
// ================== END TEMPLATE FOR PRIVATE METHODS =============================

// ================== TEMPLATE FOR PUBLIC METHODS =============================
    for (var i = 0; i < element.publicMethods.length; i++) {
        var method = element.publicMethods[i];
        methodsStr += 
`\
    public ${method.returnType} ${method.methodName} {
        /* insert code here */
    }

`
    }
// ================== END TEMPLATE FOR PUBLIC METHODS =============================

// ================== TEMPLATE FOR PROTECTED METHODS =============================
    for (var i = 0; i < element.protectedMethods.length; i++) {
        var method = element.protectedMethods[i];
        methodsStr += 
`\
    protected ${method.returnType} ${method.methodName} {
        /* insert code here */
    }

`
    }
// ================== END TEMPLATE FOR PROTECTD METHODS =============================
    return methodsStr;
}

Generator.prototype.parseXmlToclassAndInterfaceList = function(xml) {
    var mxCells = xml.getElementsByTagName("mxCell");

    // Remove the first 2 because they are the canvas elements
    for (var id = 2; id < mxCells.length; id++) {
        var mxCell = mxCells[id];
        var style = mxCell.getAttribute('style');
        var componentName = this.getComponentNameFromStyle(style);
        if (componentName) {
            this.doAction(mxCell, componentName);
        }
    }
}

Generator.prototype.doAction = function(mxCell, componentName) {
    if (componentName === 'class') {
        this.generateAndPushClassElement(mxCell);
    } else if (componentName === 'interface') {
        this.generateAndPushInterfaceElement(mxCell);
    }
    else if (componentName === 'attribute') {
        var value = mxCell.getAttribute('value');
        var parent = mxCell.getAttribute('parent');
        var parts = value.split(' ');
        var accessibility = parts[0];
        var attribute = {
            attributeName: parts[1].slice(0, -1),
            type: parts[2],
        };
        if (accessibility === "+") {
            this.classAndInterfaceLists[parent].publicAttributes.push(attribute);
        } else if (accessibility === "-") {
            this.classAndInterfaceLists[parent].privateAttributes.push(attribute);
        } else if (accessibility === "#") {
            this.classAndInterfaceLists[parent].protectedAttributes.push(attribute);
        }
    } else if (componentName === 'method') {
        var value = mxCell.getAttribute('value');
        var parent = mxCell.getAttribute('parent');
        var parts = value.split(' ');
        var accessibility = parts[0];
        var method = {
            methodName: parts[1].slice(0, -1),
            returnType: parts[2],
        };
        if (accessibility === "+") {
            this.classAndInterfaceLists[parent].publicMethods.push(method);
        } else if (accessibility === "-") {
            this.classAndInterfaceLists[parent].privateMethods.push(method);
        } else if (accessibility === "#") {
            this.classAndInterfaceLists[parent].protectedMethods.push(method);
        }
    }
}

Generator.prototype.generateAndPushClassElement = function(mxCell) {
        var element = {
            type: 'class',
            className: mxCell.getAttribute('value'),
            privateAttributes: [],
            publicAttributes: [],
            protectedAttributes: [],
            privateMethods: [],
            publicMethods: [],
            protectedMethods: [],
            implements: [],
            extends: [],
        };
        var id = mxCell.getAttribute('id');
        this.classAndInterfaceLists[id] = element;
}

Generator.prototype.generateAndPushInterfaceElement = function(mxCell) {
        var element = {
            type: 'interface',
            interfaceName: mxCell.getAttribute('value').split(' ')[1],
            privateAttributes: [],
            publicAttributes: [],
            protectedAttributes: [],
            privateMethods: [],
            publicMethods: [],
            protectedMethods: [],
            implements: [],
            extends: [],
        };
        var id = mxCell.getAttribute('id');
        this.classAndInterfaceLists[id] = element;
}

Generator.prototype.getComponentNameFromStyle = function(style) {
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
} 

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