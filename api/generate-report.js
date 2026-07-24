export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { whatBuilding, whoFor, problem, stage, goal } = req.body;

  const systemPrompt = `You are an experienced startup advisor helping a founder go from idea to execution plan. You must respond with ONLY valid JSON, no markdown formatting, no code fences, no preamble. The JSON must have exactly these keys: summary, targetCustomer, problemStatement, competitors (array of {name, difference}), opportunities (string), mvpInclude (array of strings), mvpExclude (array of strings), teamRoles (array of strings), roadmap (array of {week, focus}), risks (array of {type, description}), nextAction (string).`;

  const userMessage = `Founder's answers:
1. What are they building: ${whatBuilding}
2. Who it's for: ${whoFor}
3. Problem being solved: ${problem}
4. Current stage: ${stage}
5. Primary goal: ${goal}

Generate the structured startup report as JSON.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic API error:", data);
      return res.status(500).json({ error: "AI request failed", detail: data });
    }

    const rawText = data.content?.[0]?.text || "";
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const report = JSON.parse(cleaned);

    return res.status(200).json({ report });
  } catch (err) {
    console.error("Generate report error:", err);
    return res.status(500).json({ error: "Something went wrong generating the report." });
  }
}
