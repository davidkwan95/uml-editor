function openLocalStorageSave(sb) {
  document.body.innerHTML = '';
  var div = document.createElement('div');
  div.style.fontFamily = 'Arial';

  if (localStorage.length == 0) {
    window.parent.mxUtils.write(div, window.parent.mxResources.get('noFiles'));
  } else {
    var keys = [];

    for (var i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i));
    }

    // Sorts the array by filename (key)
    keys.sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    for (var i = 0; i < keys.length; i++) {
      var link = document.createElement('a');
      link.style.fontDecoration = 'none';
      link.style.fontSize = '14pt';
      var key = keys[i];
      window.parent.mxUtils.write(link, key);
      link.setAttribute('href', 'javascript:void(0);');
      div.appendChild(link);

      var img = document.createElement('span');
      img.className = 'geSprite geSprite-delete';
      img.style.position = 'relative';
      img.style.cursor = 'pointer';
      img.style.display = 'inline-block';
      div.appendChild(img);

      window.parent.mxUtils.br(div);

      window.parent.mxEvent.addListener(img, 'click', (function (k) {
        return function () {
          if (window.parent.mxUtils.confirm(window.parent.mxResources.get('delete') + ' "' + k + '"?')) {
            localStorage.removeItem(k);
            window.location.reload();
          }
        };
      }(key)));

      window.parent.mxEvent.addListener(link, 'click', (function (k) {
        return function () {
          try {
            window.parent.open(window.parent.location.href);
            window.parent.openFile.setData(localStorage.getItem(k), k);
          } catch (e) {
            window.parent.mxUtils.alert(e.message);
          }
        };
      }(key)));
    }
  }

  window.parent.mxUtils.br(div);
  window.parent.mxUtils.br(div);

  var cancelBtn = window.parent.mxUtils.button(window.parent.mxResources.get('cancel'), function () {
    hideWindow(true);
  });
  cancelBtn.className = 'geBtn';
  div.appendChild(cancelBtn);

  document.body.appendChild(div);
}

function openFileSystemSave(sb) {
  document.body.innerHTML = '';
  var div = document.createElement('div');
  div.style.fontFamily = 'Arial';

  var chooseBtn = window.parent.mxUtils.button('Choose File', function () {
    var uploader = document.createElement('input');
    uploader.type = 'file';
    document.body.appendChild(uploader);
    uploader.click();
    uploader.addEventListener('change', function (event) {
      // console.log(uploader.value);
      var files = uploader.files;
      var len = files.length;
      // we should read just one file
      if (len) {
        var file = files[0];
        var fileName = files[0].name;
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onloadend = function () {
          window.parent.editorUi.editor.setGraphXml(window.parent.mxUtils.parseXml(reader.result).documentElement);
          // window.parent.openFile.setData(reader.result, fileName);
          sb.hideWindow(true);
        };
      }

    }, false);
    document.body.removeChild(uploader); // remove the link when done
  });
  chooseBtn.className = 'geBtn';
  div.appendChild(chooseBtn);

  var cancelBtn = window.parent.mxUtils.button(window.parent.mxResources.get('cancel'), function () {
    hideWindow(true);
  });
  cancelBtn.className = 'geBtn';
  div.appendChild(cancelBtn);

  document.body.appendChild(div);
}

function main() {
  // bind this so can be used inside a function
  var sb = this;
  if (window.parent.Editor.useFileSystemSave) {
    openFileSystemSave(sb);
  } else if (window.parent.Editor.useLocalStorage) {
    openLocalStorageSave(sb);
  } else {
    var editLink = document.getElementById('editLink');
    var openButton = document.getElementById('openButton');
    openButton.value = window.parent.mxResources.get(window.parent.openKey || 'open');
    var cancelButton = document.getElementById('cancelButton');
    cancelButton.value = window.parent.mxResources.get('cancel');
    var supportedText = document.getElementById('openSupported');
    supportedText.innerHTML = window.parent.mxResources.get('openSupported');
    var form = window.openForm || document.getElementById('openForm');

    form.setAttribute('action', window.parent.OPEN_URL);
  }
}