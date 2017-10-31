var Parser = require('./helper/Parser');

var AbstractGenerator = function (editorUi, fileName) {
  this.editorUi = editorUi;
  this.fileName = fileName;
  this.classAndInterfaceLists = {}; // key = mxCells id
};

AbstractGenerator.prototype.generateAndSave = function () {
  var ui = this.editorUi;
  var editor = ui.editor;
  var fileName = this.fileName;

  var xmlString = mxUtils.getXml(editor.getGraphXml());
  var xml = this.xmlStringToXml(xmlString);

  var parser = new Parser();
  this.classAndInterfaceLists = parser.parseXmlToclassAndInterfaceList(xml);
  var code = this.generateCode(this.classAndInterfaceLists);

  if (code) {
    this.saveCode(fileName, code);
    ui.hideDialog();
  }
};

AbstractGenerator.prototype.generateCode = function () {
  throw 'Not implemented yet!';
};

AbstractGenerator.prototype.saveCode = function (fileName, code) {
  var data = new Blob([code], { type: 'text/plain' });

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
};

AbstractGenerator.prototype.xmlStringToXml = function (xmlString) {
  // get the function to parse xmlStr to xml
  var parseXml;

  if (window.DOMParser) {
    parseXml = function (xmlStr) {
      return (new window.DOMParser()).parseFromString(xmlStr, 'text/xml');
    };
  } else if (typeof window.ActiveXObject !== 'undefined' && new window.ActiveXObject('Microsoft.XMLDOM')) {
    parseXml = function (xmlStr) {
      var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
      xmlDoc.async = 'false';
      xmlDoc.loadXML(xmlStr);
      return xmlDoc;
    };
  } else {
    parseXml = function () {
      return null;
    };
  }

  return parseXml(xmlString);
};

module.exports = AbstractGenerator;