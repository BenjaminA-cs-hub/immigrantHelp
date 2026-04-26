import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { ingredient, language } = await request.json();

    if (!ingredient) {
      return Response.json({ error: "Missing ingredient" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a helpful food assistant for immigrants living in New York City, specifically Queens which has one of the most diverse food scenes in the world.

The user is looking for substitutes for: "${ingredient}"
Respond entirely in ${language}.

Return ONLY valid JSON with no markdown, no backticks, nothing else:
{
  "about": "2 sentences about what this ingredient is, where it comes from, and what it's used for in cooking",
  "substitutes": [
    {
      "name": "substitute ingredient name",
      "reason": "why this works as a substitute and how to use it"
    }
  ],
  "whereToFind": "specific types of stores in NYC/Queens where they can find the original ingredient or its substitutes — be specific e.g. Asian markets on Roosevelt Ave, West Indian grocery stores in Jamaica, etc."
}

Provide 3 substitutes. Be specific and practical for someone living in NYC.`,
        },
      ],
    });

   const raw = (response.content[0] as { type: "text"; text: string }).text.trim();
const cleaned = raw.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/```$/, "").trim();
console.log("Claude returned:", cleaned);
const parsed = JSON.parse(cleaned);
return Response.json(parsed);

  } catch (err: any) {
    console.error("Substitute API error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}