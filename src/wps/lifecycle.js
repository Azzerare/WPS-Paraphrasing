var taskPane = null;

function onAddinLoad(ribbonUI) {
  try {
    var app = window.Application;
    if (app && typeof app.ribbonUI !== 'object') app.ribbonUI = ribbonUI;
  } catch (e) {}
  return true;
}

function onShowPane() {
  try {
    var app = window.Application;
    if (!app) return;
    if (!taskPane) {
      taskPane = app.CreateTaskPane(location.origin + '/taskpane.html');
      if (taskPane && taskPane.ID !== undefined) {
        app.PluginStorage.setItem('taskpane_id', taskPane.ID);
      }
    } else {
      var paneId = app.PluginStorage.getItem('taskpane_id');
      if (paneId) { taskPane = app.GetTaskPane(paneId); }
    }
    if (taskPane) {
      if (taskPane.Visible !== undefined) taskPane.Visible = true;
      else if (taskPane.Show) taskPane.Show();
    }
  } catch (err) {
    console.error('onShowPane error:', err);
  }
}

function onGetImage() { return ''; }

function isEnglishSelection() {
  try {
    var app = window.Application;
    if (!app) return false;
    var sel = null;
    try { sel = app.ActiveDocument.Application.Selection; } catch (e1) {}
    if (!sel) { try { sel = app.Selection; } catch (e2) {} }
    var text = (sel && sel.Text || '').trim();
    if (!text || text.length > 60) return false;
    return /^[A-Za-z][A-Za-z'\- ]*$/.test(text);
  } catch (e) { return false; }
}

function onGetContextMenuVisible() { return isEnglishSelection(); }
function onGetSeparatorVisible() { return isEnglishSelection(); }

function onContextMenuParaphrase() {
  try {
    onShowPane();
    var ch = new BroadcastChannel('wps-paraphrasing');
    ch.postMessage({ type: 'paraphrase:fetch' });
    ch.close();
  } catch (e) {
    try { localStorage.setItem('PARAPHRASE_FETCH_SIGNAL', String(Date.now())); } catch (e2) { console.error('ctx error', e2); }
  }
}

// Expose as globals for WPS ribbon callbacks
window.OnAddinLoad = onAddinLoad;
window.OnShowPane = onShowPane;
window.OnGetImage = onGetImage;
window.OnGetContextMenuVisible = onGetContextMenuVisible;
window.OnGetSeparatorVisible = onGetSeparatorVisible;
window.OnContextMenuParaphrase = onContextMenuParaphrase;

// Named exports for module imports
export { onAddinLoad, onShowPane, onGetImage, onGetContextMenuVisible, onGetSeparatorVisible, onContextMenuParaphrase };
