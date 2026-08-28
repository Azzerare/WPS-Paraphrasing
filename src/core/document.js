// 文档操作：读取选区、提取所在句子、替换文本

function getWps() {
  if (typeof window === "undefined" || typeof window.wps === "undefined") {
    throw new Error("未检测到 WPS 环境，请通过 wpsjs debug 或在 WPS 客户端中运行");
  }
  return window.wps;
}

export function getSelectionInfo() {
  const wps = getWps();
  const doc = wps.Application.ActiveDocument;
  const sel = wps.Application.Selection;
  const text = sel.Text?.trim() ?? "";
  if (!text) return { word: "", sentence: "" };

  // 取整段，再在段内找包含选词的句子作为上下文
  const paragraphRange = sel.Paragraphs(1).Range;
  const paragraphText = paragraphRange.Text ?? "";
  const sentences = paragraphText.split(/(?<=[.!?])\s+/).filter(Boolean);
  const hit = sentences.find(s => s.includes(text)) ?? paragraphText;
  return { word: text, sentence: hit.trim() };
}

export function replaceSelection(newWord) {
  const wps = getWps();
  const sel = wps.Application.Selection;
  const original = sel.Text ?? "";

  // 大小写保持：全大写 / 首字母大写 / 默认
  let replacement = newWord;
  if (original && original === original.toUpperCase() && original.length > 1) {
    replacement = newWord.toUpperCase();
  } else if (original && /^[A-Z]/.test(original)) {
    replacement = newWord.charAt(0).toUpperCase() + newWord.slice(1);
  }

  sel.TypeText(replacement);
}
