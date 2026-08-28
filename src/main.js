// Main page entry: still a module for Vite dev server
import { onAddinLoad, onShowPane, onGetImage, onGetContextMenuVisible, onGetSeparatorVisible, onContextMenuParaphrase } from './wps/lifecycle.js';
import './styles/panel.css';
import { renderMain } from './ui/panel.js';

onAddinLoad();
renderMain();

// Expose ribbon callbacks on window for WPS to find them
window.OnAddinLoad = onAddinLoad;
window.OnShowPane = onShowPane;
window.OnGetImage = onGetImage;
window.OnGetContextMenuVisible = onGetContextMenuVisible;
window.OnGetSeparatorVisible = onGetSeparatorVisible;
window.OnContextMenuParaphrase = onContextMenuParaphrase;
