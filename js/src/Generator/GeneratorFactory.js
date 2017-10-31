var JavaGenerator = require('./Java/JavaGenerator');

var GeneratorFactory = function (editorUi, fileName, language) {
  this.editorUi = editorUi;
  this.fileName = fileName;
  this.language = language;
};

GeneratorFactory.prototype.createGenerator = function () {
  if (this.language === 'java') {
    return new JavaGenerator(this.editorUi, this.fileName);
  }
};

module.exports = GeneratorFactory;