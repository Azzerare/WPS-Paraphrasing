// 设置页 UI：多个 API Key 配置的增删改查与切换

import {
  listProfiles,
  addProfile,
  updateProfile,
  deleteProfile,
  getActiveProfileId,
  setActiveProfileId,
  DEFAULT_BASE_URL,
  DEFAULT_MODEL
} from "../settings.js";

const app = document.getElementById("app");
let returnTo = null;

export function openSettings(back) {
  returnTo = back;
  renderList();
}

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderList() {
  const profiles = listProfiles();
  const activeId = getActiveProfileId();
  const items = profiles.map(p => `
    <li class="profile ${p.id === activeId ? "active" : ""}" data-id="${p.id}">
      <div class="row">
        <span class="name" title="${esc(p.name)}">${esc(p.name)}</span>
        <span class="model">${esc(p.model)}</span>
      </div>
      <div class="row meta">
        <span class="key-mask">${maskKey(p.apiKey)}</span>
        <span class="actions">
          ${p.id === activeId
            ? `<span class="badge">使用中</span>`
            : `<button class="btn-use" data-id="${p.id}">启用</button>`}
          <button class="btn-edit" data-id="${p.id}">编辑</button>
          <button class="btn-del" data-id="${p.id}">删除</button>
        </span>
      </div>
    </li>`).join("");

  app.innerHTML = `
    <div class="settings">
      <div class="toolbar">
        <button id="btnBack" class="ghost">← 返回</button>
        <span class="title">API Key 配置</span>
        <button id="btnAdd">+ 新增</button>
      </div>
      ${profiles.length === 0
        ? `<p class="hint">还没有配置，点右上角「+ 新增」添加。</p>`
        : `<ul class="profile-list">${items}</ul>`}
    </div>`;

  document.getElementById("btnBack").addEventListener("click", () => returnTo?.());
  document.getElementById("btnAdd").addEventListener("click", () => renderForm(null));
  app.querySelectorAll(".btn-use").forEach(b => b.addEventListener("click", e => {
    setActiveProfileId(e.target.dataset.id);
    renderList();
  }));
  app.querySelectorAll(".btn-edit").forEach(b => b.addEventListener("click", e => {
    const p = profiles.find(x => x.id === e.target.dataset.id);
    renderForm(p);
  }));
  app.querySelectorAll(".btn-del").forEach(b => b.addEventListener("click", e => {
    if (confirm("确定删除该配置？")) {
      deleteProfile(e.target.dataset.id);
      renderList();
    }
  }));
}

function maskKey(key) {
  if (!key) return "";
  if (key.length <= 8) return "*".repeat(key.length);
  return key.slice(0, 4) + "*".repeat(Math.max(key.length - 8, 4)) + key.slice(-4);
}

function renderForm(profile) {
  const isEdit = !!profile;
  app.innerHTML = `
    <div class="settings">
      <div class="toolbar">
        <button id="btnBack" class="ghost">← 返回</button>
        <span class="title">${isEdit ? "编辑配置" : "新增配置"}</span>
        <span></span>
      </div>
      <form id="profileForm" class="form">
        <label>名称
          <input name="name" required maxlength="30" placeholder="如：DeepSeek 主号"
                 value="${isEdit ? esc(profile.name) : ""}"/>
        </label>
        <label>API Key
          <input name="apiKey" required type="password" placeholder="sk-..."
                 value="${isEdit ? esc(profile.apiKey) : ""}"/>
        </label>
        <label>Base URL
          <input name="baseUrl" placeholder="${DEFAULT_BASE_URL}"
                 value="${isEdit ? esc(profile.baseUrl) : ""}"/>
        </label>
        <label>模型
          <input name="model" placeholder="${DEFAULT_MODEL}"
                 value="${isEdit ? esc(profile.model) : ""}"/>
        </label>
        <p class="hint">Base URL / 模型留空时使用默认值（DeepSeek）。任何 OpenAI 兼容接口均可。</p>
        <div class="form-actions">
          <button type="submit">保存</button>
        </div>
      </form>
    </div>`;

  document.getElementById("btnBack").addEventListener("click", renderList);
  document.getElementById("profileForm").addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      name: fd.get("name"),
      apiKey: fd.get("apiKey"),
      baseUrl: fd.get("baseUrl"),
      model: fd.get("model")
    };
    try {
      if (isEdit) {
        updateProfile(profile.id, data);
      } else {
        addProfile(data);
      }
      renderList();
    } catch (err) {
      alert(err.message);
    }
  });
}
