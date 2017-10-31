/**
 * Constructs a new export dialog.
 */
var ExportDialog = function (editorUi) {
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
  mxUtils.write(td, mxResources.get('format') + ':');

  row.appendChild(td);

  var imageFormatSelect = document.createElement('select');
  imageFormatSelect.style.width = '180px';

  var pngOption = document.createElement('option');
  pngOption.setAttribute('value', 'png');
  mxUtils.write(pngOption, mxResources.get('formatPng'));
  imageFormatSelect.appendChild(pngOption);

  var gifOption = document.createElement('option');

  if (ExportDialog.showGifOption) {
    gifOption.setAttribute('value', 'gif');
    mxUtils.write(gifOption, mxResources.get('formatGif'));
    imageFormatSelect.appendChild(gifOption);
  }

  var jpgOption = document.createElement('option');
  jpgOption.setAttribute('value', 'jpg');
  mxUtils.write(jpgOption, mxResources.get('formatJpg'));
  imageFormatSelect.appendChild(jpgOption);

  var pdfOption = document.createElement('option');
  pdfOption.setAttribute('value', 'pdf');
  mxUtils.write(pdfOption, mxResources.get('formatPdf'));
  imageFormatSelect.appendChild(pdfOption);

  var svgOption = document.createElement('option');
  svgOption.setAttribute('value', 'svg');
  mxUtils.write(svgOption, mxResources.get('formatSvg'));
  imageFormatSelect.appendChild(svgOption);

  if (ExportDialog.showXmlOption) {
    var xmlOption = document.createElement('option');
    xmlOption.setAttribute('value', 'xml');
    mxUtils.write(xmlOption, mxResources.get('formatXml'));
    imageFormatSelect.appendChild(xmlOption);
  }

  td = document.createElement('td');
  td.appendChild(imageFormatSelect);
  row.appendChild(td);

  tbody.appendChild(row);

  row = document.createElement('tr');

  td = document.createElement('td');
  td.style.fontSize = '10pt';
  mxUtils.write(td, mxResources.get('zoom') + ' (%):');

  row.appendChild(td);

  var zoomInput = document.createElement('input');
  zoomInput.setAttribute('type', 'number');
  zoomInput.setAttribute('value', '100');
  zoomInput.style.width = '180px';

  td = document.createElement('td');
  td.appendChild(zoomInput);
  row.appendChild(td);

  tbody.appendChild(row);

  row = document.createElement('tr');

  td = document.createElement('td');
  td.style.fontSize = '10pt';
  mxUtils.write(td, mxResources.get('width') + ':');

  row.appendChild(td);

  var widthInput = document.createElement('input');
  widthInput.setAttribute('value', width);
  widthInput.style.width = '180px';

  td = document.createElement('td');
  td.appendChild(widthInput);
  row.appendChild(td);

  tbody.appendChild(row);

  row = document.createElement('tr');

  td = document.createElement('td');
  td.style.fontSize = '10pt';
  mxUtils.write(td, mxResources.get('height') + ':');

  row.appendChild(td);

  var heightInput = document.createElement('input');
  heightInput.setAttribute('value', height);
  heightInput.style.width = '180px';

  td = document.createElement('td');
  td.appendChild(heightInput);
  row.appendChild(td);

  tbody.appendChild(row);

  row = document.createElement('tr');

  td = document.createElement('td');
  td.style.fontSize = '10pt';
  mxUtils.write(td, mxResources.get('background') + ':');

  row.appendChild(td);

  var transparentCheckbox = document.createElement('input');
  transparentCheckbox.setAttribute('type', 'checkbox');
  transparentCheckbox.checked = graph.background == null || graph.background == mxConstants.NONE;

  td = document.createElement('td');
  td.appendChild(transparentCheckbox);
  mxUtils.write(td, mxResources.get('transparent'));

  row.appendChild(td);

  tbody.appendChild(row);

  row = document.createElement('tr');

  td = document.createElement('td');
  td.style.fontSize = '10pt';
  mxUtils.write(td, mxResources.get('borderWidth') + ':');

  row.appendChild(td);

  var borderInput = document.createElement('input');
  borderInput.setAttribute('type', 'number');
  borderInput.setAttribute('value', ExportDialog.lastBorderValue);
  borderInput.style.width = '180px';

  td = document.createElement('td');
  td.appendChild(borderInput);
  row.appendChild(td);

  tbody.appendChild(row);
  table.appendChild(tbody);

  // Handles changes in the export format
  function formatChanged() {
    var name = nameInput.value;
    var dot = name.lastIndexOf('.');

    if (dot > 0) {
      nameInput.value = name.substring(0, dot + 1) + imageFormatSelect.value;
    } else {
      nameInput.value = name + '.' + imageFormatSelect.value;
    }

    if (imageFormatSelect.value === 'xml') {
      zoomInput.setAttribute('disabled', 'true');
      widthInput.setAttribute('disabled', 'true');
      heightInput.setAttribute('disabled', 'true');
      borderInput.setAttribute('disabled', 'true');
    } else {
      zoomInput.removeAttribute('disabled');
      widthInput.removeAttribute('disabled');
      heightInput.removeAttribute('disabled');
      borderInput.removeAttribute('disabled');
    }

    if (imageFormatSelect.value === 'png' || imageFormatSelect.value === 'svg') {
      transparentCheckbox.removeAttribute('disabled');
    } else {
      transparentCheckbox.setAttribute('disabled', 'disabled');
    }
  }

  mxEvent.addListener(imageFormatSelect, 'change', formatChanged);
  formatChanged();

  function checkValues() {
    if (widthInput.value * heightInput.value > MAX_AREA || widthInput.value <= 0) {
      widthInput.style.backgroundColor = 'red';
    } else {
      widthInput.style.backgroundColor = '';
    }

    if (widthInput.value * heightInput.value > MAX_AREA || heightInput.value <= 0) {
      heightInput.style.backgroundColor = 'red';
    } else {
      heightInput.style.backgroundColor = '';
    }
  }

  mxEvent.addListener(zoomInput, 'change', function () {
    var s = Math.max(0, parseFloat(zoomInput.value) || 100) / 100;
    zoomInput.value = parseFloat((s * 100).toFixed(2));

    if (width > 0) {
      widthInput.value = Math.floor(width * s);
      heightInput.value = Math.floor(height * s);
    } else {
      zoomInput.value = '100';
      widthInput.value = width;
      heightInput.value = height;
    }

    checkValues();
  });

  mxEvent.addListener(widthInput, 'change', function () {
    var s = parseInt(widthInput.value) / width;

    if (s > 0) {
      zoomInput.value = parseFloat((s * 100).toFixed(2));
      heightInput.value = Math.floor(height * s);
    } else {
      zoomInput.value = '100';
      widthInput.value = width;
      heightInput.value = height;
    }

    checkValues();
  });

  mxEvent.addListener(heightInput, 'change', function () {
    var s = parseInt(heightInput.value) / height;

    if (s > 0) {
      zoomInput.value = parseFloat((s * 100).toFixed(2));
      widthInput.value = Math.floor(width * s);
    } else {
      zoomInput.value = '100';
      widthInput.value = width;
      heightInput.value = height;
    }

    checkValues();
  });

  row = document.createElement('tr');
  td = document.createElement('td');
  td.setAttribute('align', 'right');
  td.style.paddingTop = '22px';
  td.colSpan = 2;

  var saveBtn = mxUtils.button(mxResources.get('export'), mxUtils.bind(this, function () {
    if (parseInt(zoomInput.value) <= 0) {
      mxUtils.alert(mxResources.get('drawingEmpty'));
    } else {
      var name = nameInput.value;
      var format = imageFormatSelect.value;
      var s = Math.max(0, parseFloat(zoomInput.value) || 100) / 100;
      var b = Math.max(0, parseInt(borderInput.value));
      var bg = graph.background;

      if ((format == 'svg' || format == 'png') && transparentCheckbox.checked) {
        bg = null;
      } else if (bg == null || bg == mxConstants.NONE) {
        bg = '#ffffff';
      }

      ExportDialog.lastBorderValue = b;
      ExportDialog.exportFile(editorUi, name, format, bg, s, b);
    }
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
};

/**
 * Remembers last value for border.
 */
ExportDialog.lastBorderValue = 0;

/**
 * Global switches for the export dialog.
 */
ExportDialog.showGifOption = true;

/**
 * Global switches for the export dialog.
 */
ExportDialog.showXmlOption = true;


/**
 * Hook for getting the export format. Returns null for the default
 * intermediate XML export format or a function that returns the
 * parameter and value to be used in the request in the form
 * key=value, where value should be URL encoded.
 */
ExportDialog.exportFile = function (editorUi, name, format, bg, s, b) {
  var graph = editorUi.editor.graph;

  if (format == 'xml') {
    ExportDialog.saveLocalFile(editorUi, mxUtils.getXml(editorUi.editor.getGraphXml()), name, format);
  } else if (format == 'svg') {
    ExportDialog.saveLocalFile(editorUi, mxUtils.getXml(graph.getSvg(bg, s, b)), name, format);
  } else if (format == 'png') {
    function triggerDownload(imgURI) {
      var evt = new MouseEvent('click', {
        view: window,
        bubbles: false,
        cancelable: true
      });

      var a = document.createElement('a');
      a.setAttribute('download', name);
      a.setAttribute('href', imgURI);
      a.setAttribute('target', '_blank');

      a.dispatchEvent(evt);
    }

    var svgString = mxUtils.getXml(graph.getSvg(bg, s, b));
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var DOMURL = window.URL || window.webkitURL || window;

    var img = new Image();
    var url = 'data:image/svg+xml;charset=utf-8,' + svgString;
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      var png = canvas.toDataURL('image/png');
      DOMURL.revokeObjectURL(png);
      triggerDownload(png);
    };
    img.src = url;
  } else {
    var bounds = graph.getGraphBounds();

    // New image export
    var xmlDoc = mxUtils.createXmlDocument();
    var root = xmlDoc.createElement('output');
    xmlDoc.appendChild(root);

    // Renders graph. Offset will be multiplied with state's scale when painting state.
    var xmlCanvas = new mxXmlCanvas2D(root);
    xmlCanvas.translate(
      Math.floor((b / s - bounds.x) / graph.view.scale),
      Math.floor((b / s - bounds.y) / graph.view.scale)
    );
    xmlCanvas.scale(s / graph.view.scale);

    var imgExport = new mxImageExport();
    imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);

    // Puts request data together
    var param = 'xml=' + encodeURIComponent(mxUtils.getXml(root));
    var w = Math.ceil(bounds.width * s / graph.view.scale + 2 * b);
    var h = Math.ceil(bounds.height * s / graph.view.scale + 2 * b);
  }
};

module.exports = ExportDialog;