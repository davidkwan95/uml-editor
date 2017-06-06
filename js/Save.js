/**
 * Adds the label menu items to the given menu and parent.
 */
EditorUi.prototype.saveFile = function(forceDialog)
{
	if (!forceDialog && this.editor.filename != null)
	{
		this.save(this.editor.getOrCreateFilename());
	}
	else
	{
		var dlg = new FilenameDialog(this, this.editor.getOrCreateFilename(), mxResources.get('save'), mxUtils.bind(this, function(name)
		{
			this.save(name);
		}), null, mxUtils.bind(this, function(name)
		{
			if (name != null && name.length > 0)
			{
				return true;
			}
			
			mxUtils.confirm(mxResources.get('invalidName'));
			
			return false;
		}));
		this.showDialog(dlg.container, 300, 100, true, true);
		dlg.init();
	}
};

/**
 * Saves the current graph under the given filename.
 */
EditorUi.prototype.save = function(name)
{
	if (name != null)
	{
		if (this.editor.graph.isEditing())
		{
			this.editor.graph.stopEditing();
		}
		
		var xml = mxUtils.getXml(this.editor.getGraphXml());
		var textFile = null;
		try
		{
			if (Editor.useFileSystemSave) {
				var data = new Blob([xml], {type: 'text/plain'});

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
			}
			else if (Editor.useLocalStorage)
			{
				if (localStorage.getItem(name) != null &&
					!mxUtils.confirm(mxResources.get('replaceIt', [name])))
				{
					return;
				}

				localStorage.setItem(name, xml);
				this.editor.setStatus(mxResources.get('saved') + ' ' + new Date());
			}
			else
			{
				if (xml.length < MAX_REQUEST_SIZE)
				{
					new mxXmlRequest(SAVE_URL, 'filename=' + encodeURIComponent(name) +
						'&xml=' + encodeURIComponent(xml)).simulate(document, '_blank');
				}
				else
				{
					mxUtils.alert(mxResources.get('drawingTooLarge'));
					mxUtils.popup(xml);
					
					return;
				}
			}

			this.editor.setModified(false);
			this.editor.setFilename(name);
			this.updateDocumentTitle();
		}
		catch (e)
		{
			this.editor.setStatus('Error saving file');
		}
	}
};