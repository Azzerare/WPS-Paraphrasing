# WPS-Paraphrasing

WPS Writer 同义替换加载项：选中文档中的英文单词或短语，右键"同义替换"，即可获得 **8 个结合上下文的英文候选词**（5 个单词 + 3 个短语），每个候选词附带中文释义和替换效果说明，点击即完成替换。

## 功能特性

- **留学文书场景优化**：提示词针对学术申请文书（Personal Statement / SOP）优化，推荐符合正式学术写作风格、避免陈词滥调的表达。
- **上下文感知**：取选中文本前后各约 600 字符（约 1–3 句）作为语境，LLM 结合上下文判断词性和搭配后排序推荐。
- **候选词分类**：8 个候选 = 5 个单词 + 3 个短语（2–4 词），按上下文匹配度排序。
- **双语小字说明**：每个候选词下方显示中文释义（灰色）和替换效果（绿色斜体，说明替换后语气/精度的变化）。
- **一键替换**：点击候选词即替换文档中的选中文本，自动保持原有大小写格式。
- **多配置管理**：支持配置多套 API Key（DeepSeek / OpenAI / 兼容服务），可切换、编辑、删除。
- **点击空白处关闭**：点击 WPS 其他区域时弹窗自动消失（blur 事件触发）。

## 技术栈

| 层 | 技术 | 说明 |
|---|---|---|
| 构建工具 | Vite 5 | 开发服务器（`127.0.0.1:3889`）与打包 |
| 加载项框架 | WPS JS 加载项 | `jsplugins.xml` + `ribbon.xml` 注册，`wpsjs` CLI 调试 |
| 前端 | 原生 HTML / CSS / JS | 无框架，dialog 与 taskpane 均为单文件内联 |
| LLM 接入 | OpenAI 兼容 Chat Completions API | 默认 DeepSeek（`deepseek-chat`），支持任意兼容服务 |
| 本地服务 | PowerShell HttpListener | `server.ps1` 提供 `http://127.0.0.1:3889/` 静态文件服务，开机自启 |
| 打包分发 | 7z + install.bat | 一键安装到 `%APPDATA%\kingsoft\wps\jsaddons\` |

## WPS 特性使用

- **`ribbon.xml` contextMenus**：注册右键菜单按钮（`ContextMenuText`），在文字（Writer）组件中选词后可直接触发。
- **`Application.ShowDialog()`**：WPS JS API 的模态对话框，用于弹出候选词面板（480×800）和设置页。
- **`Application.ActiveDocument`**：读取文档内容（上下文）和选区（选中的词），通过 `Selection.TypeText()` 完成替换。
- **`jsplugins.xml`**：WPS 加载项注册清单，指向本地 HTTP 服务的入口页面。

## 目录结构

```
WPS-Paraphrasing/
├── index.html                  # 加载项入口（lifecycle：OnAddinLoad / OnContextMenuParaphrase / ShowDialog）
├── ribbon.xml                  # WPS 右键菜单注册
├── jsplugins.xml               # WPS 加载项清单
├── vite.config.mjs             # Vite 配置（dev server 端口 3889）
├── package.json
├── public/                     # Vite 静态资源（dist 同源）
│   ├── dialog.html             # 右键替换弹窗（候选词列表 + LLM 调用）
│   ├── taskpane.html           # 设置面板（多配置管理）
│   └── ui/taskpane.js          # 设置面板逻辑
├── wps-addon-build/
│   ├── WPS-Paraphrasing.7z    # 分发包
│   └── WPS-Paraphrasing_0.1.0/ # 安装包内容（install.bat / server.ps1 等）
├── docs/
└── pages/
```

## 使用方式

### 本机开发

```bash
npm install
npm run dev        # 启动 Vite 开发服务器 (127.0.0.1:3889)
npm run wps-debug  # 调试 WPS 加载项（需要 wpsjs CLI）
```

### 一键安装（离线分发）

1. 把 `wps-addon-build/WPS-Paraphrasing.7z` 发给对方
2. 解压到任意位置
3. 双击 `install.bat`
4. 重启 WPS

安装脚本会：
- 把插件文件复制到 `%APPDATA%\kingsoft\wps\jsaddons\WPS-Paraphrasing\`
- 写入 `publish.xml`（WPS 每次启动读取）
- 在启动文件夹创建快捷方式，开机自动启动本地 HTTP 服务

之后每次使用：开机 → 服务自动后台启动 → 打开 WPS → 右键"同义替换"。

### 配置 API Key

首次使用时，弹窗或设置页会提示输入 API Key。默认使用 DeepSeek（`https://api.deepseek.com/v1`，`deepseek-chat`），也可以配置其他 OpenAI 兼容服务。

API Key 存储在本机 WPS WebView 的 `localStorage`，不上传、不进入代码库。

## 许可证

暂未确定，个人使用。
