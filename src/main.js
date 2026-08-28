// 入口：加载项任务窗格
import { onAddinLoad, onShowPane, onGetImage, onGetContextMenuVisible, onGetSeparatorVisible, onContextMenuParaphrase } from "./wps/lifecycle.js";
import "./styles/panel.css";
import { renderMain } from "./ui/panel.js";

onAddinLoad();
renderMain();

// Ribbon callbacks must be on window for WPS to find them
window.OnAddinLoad = onAddinLoad;
window.OnShowPane = onShowPane;
window.OnGetImage = onGetImage;
window.OnGetContextMenuVisible = onGetContextMenuVisible;
window.OnGetSeparatorVisible = onGetSeparatorVisible;
window.OnContextMenuParaphrase = onContextMenuParaphrase;
