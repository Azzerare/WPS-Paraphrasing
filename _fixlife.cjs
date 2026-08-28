// WPS"��y��yۧu���}�w^~)�v��y��yۧu���}�w^~)�v��y��yۧu���ARibbon"��y��yۧu���C�w^~)�v��y��yۧu���n�w^~)�v��y��yۧu���^�w^~)�w

let taskPane = null;

function getWps() {
  return (typeof window !== "undefined" && window.wps) ? window.wps : null;
}

export function onAddinLoad() {
  if (getWps()) {
    console.log("WPS JSAPI ready");
  }
}

export function onShowPane() {
  try {
    const wps = getWps();
    if (!wps) return;
    if (!taskPane) {
      taskPane = wps.CreateTaskPane(location.origin + "/index.html");
    }
    if (taskPane && taskPane.Show) {
      taskPane.Show();
    }
  } catch (err) {
    console.error("onShowPane error:", err);
  }
}

export function onGetImage() {
  return "";
}

// ----"��y��yۧu���n�w^~)�v��y��y� ----

function isEnglishSelection() {
  try {
    const wps = getWps();
    if (!wps || !wps.Application) return false;
    const text = (wps.Application.Selection && wps.Application.Selection.Text || "").trim();
    if (!text || text.length > 60) return false;
    return /^[A-Za-z][A-Za-z'\- ]*$/.test(text);
  } catch (e) {
    return false;
  }
}

export function onGetContextMenuVisible() {
  return isEnglishSelection();
}

export function onGetSeparatorVisible() {
  return isEnglishSelection();
}

export function onContextMenuParaphrase() {
  try {
    onShowPane();
    const channel = new BroadcastChannel("wps-paraphrasing");
    channel.postMessage({ type: "paraphrase:fetch" });
    channel.close();
  } catch (e) {
    try {
      localStorage.setItem("PARAPHRASE_FETCH_SIGNAL", String(Date.now()));
    } catch (e2) {
      console.error("onContextMenuParaphrase error:", e2);
    }
  }
}
