// WPS 加载项生命周期与 JSAPI 桥接

export function onAddinLoad() {
  // wpsjs debug 时 WPS 会向 window 注入 wps 对象
  if (typeof window.wps !== "undefined") {
    console.log("WPS JSAPI ready");
  }
}

export function onShowPane() {
  // 由 ribbon.xml 的 OnShowPane 触发，打开任务窗格
  if (typeof window.wps !== "undefined" && window.wps.Enum) {
    const pane = window.wps.CreateTaskPane("./index.html");
    if (pane && pane.Show) pane.Show();
  }
}
