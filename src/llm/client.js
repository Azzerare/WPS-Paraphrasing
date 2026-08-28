// 大模型直连客户端：负责与 LLM API 通信，不经过任何数据库/后端

const DEFAULT_SYSTEM_PROMPT = [
  "你是一个英文写作助手。",
  "用户会给出一个英文单词/短语及其所在句子。",
  "请推荐 5 个语义相同或相近、符合当前句子语境且搭配地道的英文同义/近义候选词。",
  "要求：",
  "1. 候选词词性与原词在句中一致；",
  "2. 排除原词本身及其简单变体；",
  "3. 按语境适配度从高到低排序；",
  "4. 每个候选词附上 1 句简短中文说明（为何适配当前语境）。",
  "严格以 JSON 数组输出，不要输出其他内容：",
  '[{"word":"...","reason":"..."}]'
].join("\n");

export function createLlmClient({ apiKey, baseUrl = "https://api.openai.com/v1", model = "gpt-4o-mini" }) {
  if (!apiKey) throw new Error("LLM apiKey 未配置，请在设置中填写");

  async function requestSynonyms({ word, sentence }) {
    const userPrompt = `选中的词：「${word}」\n所在句子：「${sentence}」`;

    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: DEFAULT_SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`LLM 请求失败(${res.status}): ${text}`);
    }

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content ?? "";
    let candidates;
    try {
      candidates = JSON.parse(raw);
    } catch {
      // 某些模型即使指定 response_format 也可能包一层代码块，兜底提取
      const match = raw.match(/\[[\s\S]*\]/);
      if (!match) throw new Error("LLM 返回内容无法解析为 JSON");
      candidates = JSON.parse(match[0]);
    }
    if (!Array.isArray(candidates)) throw new Error("LLM 返回结构异常");
    return candidates.slice(0, 5);
  }

  return { requestSynonyms };
}
