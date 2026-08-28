# 架构说明（骨架版）

## 技术栈

- 加载项框架：WPS JS 加载项（`jsplugins.xml` + ribbon.xml + 任务窗格）
- 构建工具：Vite（`base: "./"`，产物为纯静态文件，输出到 `dist/`）
- 前端 UI：原生 DOM（保持包体小、加载快；后续如复杂化可换 Vue/React）
- LLM 通信：`fetch` 直连大模型 API（OpenAI 兼容协议），无数据库、无自有后端

## 目录

```
WPS-Paraphrasing/
├── jsplugins.xml        # WPS 加载项清单
├── ribbon.xml           # 自定义 Ribbon（同义替换 Tab）
├── pages/index.html     # 任务窗格入口
├── src/
│   ├── main.js          # 入口
│   ├── settings.js      # API Key / 模型配置（localStorage）
│   ├── wps/lifecycle.js # OnAddinLoad / OnShowPane
│   ├── core/document.js # 选区读取 / 句子提取 / 替换
│   ├── llm/client.js    # LLM 直连（OpenAI 兼容 chat/completions）
│   ├── ui/panel.js      # 候选词面板
│   └── styles/panel.css
├── vite.config.mjs
└── package.json
```

## 数据流

```
用户选词 → getSelectionInfo() 读选区+所在句
        → createLlmClient({apiKey, baseUrl, model}).requestSynonyms()
        → fetch POST {baseUrl}/chat/completions（JSON mode，temperature 0.3）
        → 解析 5 个候选词 [{word, reason}]
        → renderCandidates() 点击候选词 → replaceSelection()
```

## 限制与注意

- **开发期直连 LLM**：API Key 存 localStorage，只适合本地开发。正式发布必须加一层后端代理（或使用 WPS 官方 AI 能力），避免 Key 被抓包/窃取。
- **CORS**：多数 LLM API 不允许浏览器直接跨域调用。调试可通过代理服务器，或选择允许浏览器端调用的模型服务商（如部分 OpenAI 兼容网关）。如遇 CORS，在 `llm/client.js` 里把 `baseUrl` 指向自建轻量代理即可，代码无需改动。
- **HTTPS**：正式部署要求加载项页面与 LLM 接口均为 HTTPS（自签证书在 WPS 中需要额外信任配置）。
- **大模型 JSON 输出**：`client.js` 已设置 `response_format: json_object`，并带一层正则兜底解析。
