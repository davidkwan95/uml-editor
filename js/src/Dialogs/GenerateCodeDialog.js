var GeneratorFactory = require('../Generator/GeneratorFactory');

/**
 * Constructs a new Generate Code dialog.
   For examples to add languages, check ExportDialog class
 */
var GenerateCodeDialog = function (editorUi) {
  var graph = editorUi.editor.graph;
  var bounds = graph.getGraphBounds();
  var scale = graph.view.scale;

  var width = Math.ceil(bounds.width / scale);
  var height = Math.ceil(bounds.height / scale);

  var row,
    td;

  var table = document.createElement('table');
  var tbody = document.createElement('tbody');
  table.setAttribute('cellpadding', (mxClient.IS_SF) ? '0' : '2');

  row = document.createElement('tr');

  td = document.createElement('td');
  td.style.fontSize = '10pt';
  td.style.width = '100px';
  mxUtils.write(td, mxResources.get('filename') + ':');

  row.appendChild(td);

  var nameInput = document.createElement('input');
  nameInput.setAttribute('value', editorUi.editor.getOrCreateFilename());
  nameInput.style.width = '180px';

  td = document.createElement('td');
  td.appendChild(nameInput);
  row.appendChild(td);

  tbody.appendChild(row);

  row = document.createElement('tr');

  td = document.createElement('td');
  td.style.fontSize = '10pt';
  mxUtils.write(td, mxResources.get('language') + ':');

  row.appendChild(td);

  var languageSelect = document.createElement('select');
  languageSelect.style.width = '180px';

  var javaOption = document.createElement('option');
  javaOption.setAttribute('value', 'java');
  mxUtils.write(javaOption, mxResources.get('languageJava'));
  languageSelect.appendChild(javaOption);

  td = document.createElement('td');
  td.appendChild(languageSelect);
  row.appendChild(td);

  tbody.appendChild(row);

  table.appendChild(tbody);

  row = document.createElement('tr');
  td = document.createElement('td');
  td.setAttribute('align', 'right');
  td.style.paddingTop = '22px';
  td.colSpan = 2;

  var saveBtn = mxUtils.button(mxResources.get('generate'), mxUtils.bind(this, function () {
    var name = nameInput.value;
    var language = languageSelect.value;
    var generator = new GeneratorFactory(editorUi, name, language).createGenerator();
    generator.generateAndSave();
  }));
  saveBtn.className = 'geBtn gePrimaryBtn';

  var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
    editorUi.hideDialog();
  });
  cancelBtn.className = 'geBtn';

  if (editorUi.editor.cancelFirst) {
    td.appendChild(cancelBtn);
    td.appendChild(saveBtn);
  } else {
    td.appendChild(saveBtn);
    td.appendChild(cancelBtn);
  }

  row.appendChild(td);
  tbody.appendChild(row);
  table.appendChild(tbody);
  this.container = table;

  // Handles changes in the export format
  function formatChanged() {
    var name = nameInput.value;
    var dot = name.lastIndexOf('.');

    if (dot > 0) {
      nameInput.value = name.substring(0, dot + 1) + languageSelect.value;
    } else {
      nameInput.value = name + '.' + languageSelect.value;
    }
  }

  mxEvent.addListener(languageSelect, 'change', formatChanged);
  formatChanged();
};

/**
 * Remembers last value for border.
 */
GenerateCodeDialog.lastBorderValue = 0;

module.exports = GenerateCodeDialog;