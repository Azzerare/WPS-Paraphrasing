// 任务窗格主面板：选词 → 获取候选词 → 点击替换

import { getSelectionInfo, replaceSelection } from "../core/document.js";
import { createLlmClient } from "../llm/client.js";
import { getActiveProfile } from "../settings.js";
import { openSettings } from "./settings.js";

const app = document.getElementById("app");

export function renderMain() {
  const profile = getActiveProfile();
  const statusText = profile
    ? `当前配置：${profile.name}`
    : `未配置 API Key`;
  const statusClass = profile ? "ok" : "warn";

  app.innerHTML = `
    <div class="panel">
      <div class="topbar">
        <span class="status ${statusClass}">${statusText}</span>
        <button id="btnSettings" class="ghost">⚙ 设置</button>
      </div>
      <p class="hint">在文档中选中一个英文单词，然后点击下方按钮。</p>
      <button id="btnFetch">获取同义候选</button>
      <div id="result"></div>
    </div>`;

  document.getElementById("btnSettings").addEventListener("click", () => openSettings(renderMain));
  document.getElementById("btnFetch").addEventListener("click", fetchCandidates);
  window.addEventListener("storage", e => {
    if (e.key === "PARAPHRASE_FETCH_SIGNAL") {
      fetchCandidates();
    }
  });
  try {
    const channel = new BroadcastChannel("wps-paraphrasing");
    channel.onmessage = e => {
      if (e.data && e.data.type === "paraphrase:fetch") {
        fetchCandidates();
      }
    };
  } catch (e) {
    // BroadcastChannel 不可用时静默，storage 事件已覆盖大部分场景
  }
}

function renderLoading() {
  document.getElementById("result").innerHTML = `<p class="loading">正在结合上下文生成候选词…</p>`;
}

function renderError(msg) {
  document.getElementById("result").innerHTML = `<p class="error">${esc(msg)}</p>`;
}

function renderCandidates(candidates) {
  const list = candidates.map(c => `
    <li>
      <div class="word">${esc(c.word)}</div>
      <div class="reason">${esc(c.reason ?? "")}</div>
    </li>`).join("");
  document.getElementById("result").innerHTML = `<ol class="candidates">${list}</ol>`;
  app.querySelectorAll(".candidates li").forEach((li, i) => {
    li.addEventListener("click", () => replaceSelection(candidates[i].word));
  });
}

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function fetchCandidates() {
  const profile = getActiveProfile();
  if (!profile) {
    renderError("尚未配置 API Key，请先到「设置」添加");
    return;
  }

  renderLoading();
  try {
    const { word, sentence } = getSelectionInfo();
    if (!word) {
      renderError("请先在文档中选中一个英文单词");
      return;
    }
    const client = createLlmClient({
      apiKey: profile.apiKey,
      baseUrl: profile.baseUrl,
      model: profile.model
    });
    const candidates = await client.requestSynonyms({ word, sentence });
    renderCandidates(candidates);
  } catch (err) {
    renderError(err.message ?? String(err));
  }
}

renderMain();
