// 简易设置读取（API Key / 模型名），从 localStorage 获取

export function getSettings() {
  return {
    apiKey: localStorage.getItem("PARAPHRASE_LLM_KEY") ?? "",
    baseUrl: localStorage.getItem("PARAPHRASE_LLM_BASE") ?? "https://api.openai.com/v1",
    model: localStorage.getItem("PARAPHRASE_LLM_MODEL") ?? "gpt-4o-mini"
  };
}
