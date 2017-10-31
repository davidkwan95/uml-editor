/**
 * Adds the label menu items to the given menu and parent.
 */
var saveFile = function (ui, forceDialog) {
  if (!forceDialog && ui.editor.filename != null) {
    ui.save(ui.editor.getOrCreateFilename());
  } else {
    var dlg = new FilenameDialog(ui, ui.editor.getOrCreateFilename(), mxResources.get('save'), mxUtils.bind(ui, function (name) {
      save(ui, name);
    }), null, mxUtils.bind(ui, function (name) {
      if (name != null && name.length > 0) {
        return true;
      }

      mxUtils.confirm(mxResources.get('invalidName'));

      return false;
    }));
    ui.showDialog(dlg.container, 300, 100, true, true);
    dlg.init();
  }
};

/**
 * Saves the current graph under the given filename.
 */
var save = function (ui, name) {
  if (name != null) {
    if (ui.editor.graph.isEditing()) {
      ui.editor.graph.stopEditing();
    }

    var xml = mxUtils.getXml(ui.editor.getGraphXml());
    var textFile = null;
    try {
      if (Editor.useFileSystemSave) {
        var data = new Blob([xml], { type: 'text/plain' });

			    // If we are replacing a previously generated file we need to
			    // manually revoke the object URL to avoid memory leaks.
			    if (textFile !== null) {
			      window.URL.revokeObjectURL(textFile);
			    }

			    textFile = window.URL.createObjectURL(data);

			    var link = document.createElement('a');
			    if (typeof link.download === 'string') {
			        document.body.appendChild(link); // Firefox requires the link to be in the body
			        link.download = name;
			        link.href = textFile;
			        link.click();
			        document.body.removeChild(link); // remove the link when done
			    } else {
			        location.replace(uri);
			    }


        return;
      } else if (Editor.useLocalStorage) {
        if (localStorage.getItem(name) != null &&
					!mxUtils.confirm(mxResources.get('replaceIt', [name]))) {
          return;
        }

        localStorage.setItem(name, xml);
        ui.editor.setStatus(mxResources.get('saved') + ' ' + new Date());
      } else
      if (xml.length < MAX_REQUEST_SIZE) {
        new mxXmlRequest(SAVE_URL, 'filename=' + encodeURIComponent(name) +
						'&xml=' + encodeURIComponent(xml)).simulate(document, '_blank');
      } else {
        mxUtils.alert(mxResources.get('drawingTooLarge'));
        mxUtils.popup(xml);

        return;
      }

      ui.editor.setModified(false);
      ui.editor.setFilename(name);
      ui.updateDocumentTitle();
    } catch (e) {
      ui.editor.setStatus('Error saving file');
    }
  }
};

module.exports = saveFile;