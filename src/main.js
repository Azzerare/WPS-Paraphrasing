// 入口：加载项任务窗格
import { onAddinLoad } from "./wps/lifecycle.js";
import "./styles/panel.css";
import { renderMain } from "./ui/panel.js";

onAddinLoad();
renderMain();
