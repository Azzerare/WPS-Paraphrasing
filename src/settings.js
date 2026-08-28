// 设置存储：多个 API Key 配置（个人使用，存于 WPS WebView localStorage）

const PROFILES_KEY = "PARAPHRASE_PROFILES";
const ACTIVE_KEY = "PARAPHRASE_ACTIVE_PROFILE";

// 新增配置时的默认端点/模型（OpenAI 兼容协议，可改为任意兼容服务商）
export const DEFAULT_BASE_URL = "https://api.deepseek.com/v1";
export const DEFAULT_MODEL = "deepseek-chat";

function readProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeProfiles(profiles) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function listProfiles() {
  return readProfiles();
}

function newId() {
  return `profile_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function addProfile({ name, apiKey, baseUrl, model }) {
  if (!name?.trim() || !apiKey?.trim()) {
    throw new Error("名称与 API Key 不能为空");
  }
  const profile = {
    id: newId(),
    name: name.trim(),
    apiKey: apiKey.trim(),
    baseUrl: (baseUrl ?? "").trim() || DEFAULT_BASE_URL,
    model: (model ?? "").trim() || DEFAULT_MODEL
  };
  const profiles = readProfiles();
  profiles.push(profile);
  writeProfiles(profiles);
  if (!getActiveProfileId()) {
    setActiveProfileId(profile.id);
  }
  return profile;
}

export function updateProfile(id, patch) {
  const profiles = readProfiles();
  const idx = profiles.findIndex(p => p.id === id);
  if (idx === -1) {
    throw new Error("配置不存在");
  }
  const current = profiles[idx];
  const merged = {
    ...current,
    name: (patch.name ?? current.name).trim(),
    apiKey: (patch.apiKey ?? current.apiKey).trim(),
    baseUrl: (patch.baseUrl ?? current.baseUrl).trim() || DEFAULT_BASE_URL,
    model: (patch.model ?? current.model).trim() || DEFAULT_MODEL
  };
  if (!merged.name || !merged.apiKey) {
    throw new Error("名称与 API Key 不能为空");
  }
  profiles[idx] = merged;
  writeProfiles(profiles);
  return merged;
}

export function deleteProfile(id) {
  const profiles = readProfiles().filter(p => p.id !== id);
  writeProfiles(profiles);
  if (getActiveProfileId() === id) {
    localStorage.removeItem(ACTIVE_KEY);
    if (profiles.length > 0) {
      setActiveProfileId(profiles[0].id);
    }
  }
}

export function getActiveProfileId() {
  return localStorage.getItem(ACTIVE_KEY) ?? "";
}

export function setActiveProfileId(id) {
  localStorage.setItem(ACTIVE_KEY, id);
}

export function getActiveProfile() {
  const id = getActiveProfileId();
  return readProfiles().find(p => p.id === id) ?? null;
}
