// WPS 加载项生命周期、Ribbon 回调与右键菜单回调

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
  const wps = getWps();
  if (!wps) return;
  if (!taskPane) {
    taskPane = wps.CreateTaskPane("./index.html");
  }
  if (taskPane && taskPane.Show) {
    taskPane.Show();
  }
}

export function onGetImage() {
  return "";
}

// ---- 右键菜单 ----

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
  onShowPane();
  // 通过 BroadcastChannel 通知任务窗格拉取候选词（同源所有上下文可收）
  try {
    const channel = new BroadcastChannel("wps-paraphrasing");
    channel.postMessage({ type: "paraphrase:fetch" });
    channel.close();
  } catch (e) {
    // BroadcastChannel 不可用时兜底 localStorage（跨 window 触发 storage 事件）
    localStorage.setItem("PARAPHRASE_FETCH_SIGNAL", String(Date.now()));
  }
}
