/**
 * Hook for getting the export format. Returns null for the default
 * intermediate XML export format or a function that returns the
 * parameter and value to be used in the request in the form
 * key=value, where value should be URL encoded.
 */
ExportDialog.exportFile = function(editorUi, name, format, bg, s, b)
{
    var graph = editorUi.editor.graph;
    
    if (format == 'xml')
    {
        ExportDialog.saveLocalFile(editorUi, mxUtils.getXml(editorUi.editor.getGraphXml()), name, format);
    }
    else if (format == 'svg')
    {
        ExportDialog.saveLocalFile(editorUi, mxUtils.getXml(graph.getSvg(bg, s, b)), name, format);
    }
    else if (format == 'png')
    {
        function triggerDownload (imgURI) {
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
        img.crossOrigin = "anonymous";
        var svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
        var url = DOMURL.createObjectURL(svgBlob);
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            var png = canvas.toDataURL("image/png");
            DOMURL.revokeObjectURL(png);
            triggerDownload(png);
        };
        img.src = url;
    }
    else
    {
        var bounds = graph.getGraphBounds();
        
        // New image export
        var xmlDoc = mxUtils.createXmlDocument();
        var root = xmlDoc.createElement('output');
        xmlDoc.appendChild(root);
        
        // Renders graph. Offset will be multiplied with state's scale when painting state.
        var xmlCanvas = new mxXmlCanvas2D(root);
        xmlCanvas.translate(Math.floor((b / s - bounds.x) / graph.view.scale),
            Math.floor((b / s - bounds.y) / graph.view.scale));
        xmlCanvas.scale(s / graph.view.scale);
        
        var imgExport = new mxImageExport()
        imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);

        // Puts request data together
        var param = 'xml=' + encodeURIComponent(mxUtils.getXml(root));
        var w = Math.ceil(bounds.width * s / graph.view.scale + 2 * b);
        var h = Math.ceil(bounds.height * s / graph.view.scale + 2 * b);
        
        // console.log(mxUtils.getXml(root));

        // Requests image if request is valid
        // if (param.length <= MAX_REQUEST_SIZE && w * h < MAX_AREA)
        // {
        //  editorUi.hideDialog();
        //  var req = new mxXmlRequest(EXPORT_URL, 'format=' + format +
        //      '&filename=' + encodeURIComponent(name) +
        //      '&bg=' + ((bg != null) ? bg : 'none') +
        //      '&w=' + w + '&h=' + h + '&' + param);
        //  req.simulate(document, '_blank');
        // }
        // else
        // {
        //  mxUtils.alert(mxResources.get('drawingTooLarge'));
        // }
    }
};