// 任务窗格 UI 渲染（原生 DOM，保持轻量）

import { getSelectionInfo, replaceSelection } from "../core/document.js";
import { createLlmClient } from "../llm/client.js";

const app = document.getElementById("app");

function renderIdle() {
  app.innerHTML = `
    <div class="panel">
      <p class="hint">在文档中选中一个英文单词，然后点击下方按钮。</p>
      <button id="btnFetch">获取同义候选</button>
      <div id="result"></div>
    </div>`;
  document.getElementById("btnFetch").addEventListener("click", fetchCandidates);
}

function renderLoading() {
  document.getElementById("result").innerHTML = `<p class="loading">正在结合上下文生成候选词…</p>`;
}

function renderError(msg) {
  document.getElementById("result").innerHTML = `<p class="error">${msg}</p>`;
}

function renderCandidates(candidates) {
  const list = candidates.map(c => `
    <li>
      <div class="word">${c.word}</div>
      <div class="reason">${c.reason ?? ""}</div>
    </li>`).join("");
  document.getElementById("result").innerHTML = `<ol class="candidates">${list}</ol>`;
  app.querySelectorAll(".candidates li").forEach((li, i) => {
    li.addEventListener("click", () => replaceSelection(candidates[i].word));
  });
}

async function fetchCandidates() {
  // 开发期直接在本地存储读取 API Key；正式发布建议改为自有后端代理以避免 Key 泄露
  const apiKey = localStorage.getItem("PARAPHRASE_LLM_KEY") ?? "";
  const client = createLlmClient({ apiKey });

  renderLoading();
  try {
    const { word, sentence } = getSelectionInfo();
    if (!word) {
      renderError("请先在文档中选中一个英文单词");
      return;
    }
    const candidates = await client.requestSynonyms({ word, sentence });
    renderCandidates(candidates);
  } catch (err) {
    renderError(err.message ?? String(err));
  }
}

renderIdle();
