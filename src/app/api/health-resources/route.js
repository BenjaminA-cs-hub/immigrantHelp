import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { query } = await request.json();

    const nycRes = await fetch(
      "https://data.cityofnewyork.us/resource/q6fj-vxf8.json?$limit=100"
    );
    const facilities = await nycRes.json();

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a helpful multilingual health resource assistant for immigrants in NYC.
          
A user is looking for health resources with this request: "${query}"

Here is a list of real NYC health facilities:
${JSON.stringify(facilities, null, 2)}

Based on their request:
1. Detect what language they wrote in and respond in that same language
2. Filter the most relevant facilities from the list above
3. Return your response as a JSON object like this:
{
  "message": "A friendly intro message in the user's language",
  "results": [
    {
      "name": "facility name",
      "type": "facility type",
      "borough": "borough",
      "phone": "phone number",
      "reason": "why this is relevant to the user in their language"
    }
  ]
}

Only return the raw JSON, no markdown, no backticks, nothing else.`,
        },
      ],
    });

    const raw = response.content[0].text;
    const data = JSON.parse(raw);
    return Response.json(data);

  } catch (err) {
    console.error("Health resources error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}