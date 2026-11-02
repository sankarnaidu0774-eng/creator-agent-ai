type RequestBody = { topic?: string; audience?: string; platform?: string; duration?: number; tone?: string };
type ApiRequest = { method?: string; body?: RequestBody };
type ApiResponse = { status: (code: number) => ApiResponse; json: (value: unknown) => void; setHeader: (name: string, value: string) => void };

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });
  const { topic, audience = "Beginners", platform = "YouTube Shorts", duration = 30, tone = "engaging" } = req.body ?? {};
  if (!topic?.trim() || topic.length > 1200) return res.status(400).json({ error: "Enter a topic (maximum 1,200 characters)." });
  if (![30, 60, 90].includes(Number(duration))) return res.status(400).json({ error: "Duration must be 30, 60 or 90 seconds." });

  const prompt = `Create a production-ready short-video script and storyboard. Topic: ${topic}. Audience: ${audience}. Platform: ${platform}. Target duration: ${duration} seconds. Tone: ${tone}. Return ONLY valid JSON in this exact shape: {"title":"...","hook":"...","description":"...","hashtags":["#..."],"scenes":[{"title":"...","visual":"...","narration":"...","duration":8}]}. Include 4-7 scenes whose durations add up to approximately ${duration} seconds. Make narration factual, clear and natural. Do not invent sources or facts; flag uncertainty in the narration when necessary.`;

  try {
    let raw = "";
    if (process.env.GEMINI_API_KEY) {
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.7 } }),
      });
      const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; error?: { message?: string } };
      if (!response.ok) throw new Error(data.error?.message || "Gemini request failed.");
      raw = data.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "";
    } else if (process.env.OPENAI_API_KEY) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", temperature: 0.7, response_format: { type: "json_object" }, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await response.json() as { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } };
      if (!response.ok) throw new Error(data.error?.message || "OpenAI request failed.");
      raw = data.choices?.[0]?.message?.content || "";
    } else {
      return res.status(503).json({ error: "AI provider is not configured. Add GEMINI_API_KEY or OPENAI_API_KEY in the Vercel project environment variables." });
    }
    const parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, ""));
    if (!parsed.title || !Array.isArray(parsed.scenes) || parsed.scenes.length === 0) throw new Error("The AI returned an incomplete storyboard. Please try again.");
    const scenes = parsed.scenes.map((s: Record<string, unknown>) => ({
      title: String(s.title || "Scene"), visual: String(s.visual || ""), narration: String(s.narration || ""),
      duration: Math.max(1, Math.min(60, Number(s.duration) || 5)),
    }));
    return res.status(200).json({ ...parsed, scenes, provider: process.env.GEMINI_API_KEY ? "Gemini" : "OpenAI" });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : "AI generation failed." });
  }
}
