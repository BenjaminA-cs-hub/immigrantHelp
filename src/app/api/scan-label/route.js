import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { imageBase64, mediaType, language } = await request.json();

    if (!imageBase64 || !mediaType) {
      return Response.json({ error: "Missing image data" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: `You are a multilingual nutrition assistant for immigrants.
Analyze this food label and respond ONLY in valid JSON with no markdown, no backticks, nothing else.
Respond entirely in ${language}.

Return this exact structure:
{
  "product_name": "name of the product",
  "summary": "one friendly sentence about what this product is",
  "nutrients": [
    {
      "name": "nutrient name in ${language}",
      "amount": "amount with unit",
      "level": "good" | "warning" | "bad",
      "note": "brief note about this nutrient in ${language}"
    }
  ],
  "allergens": ["allergen1", "allergen2"],
  "cultural_note": "cultural context relevant to immigrants e.g. high sodium warning for low-sodium cuisines, or null if not applicable",
  "verdict": "overall short friendly verdict in ${language} — is this a good choice?"
}

Include the 4-6 most important nutrients only. If no allergens, return an empty array.`,
            },
          ],
        },
      ],
    });

    const raw = response.content[0].text.trim();
    const parsed = JSON.parse(raw);
    return Response.json({ result: parsed });

  } catch (err) {
    console.error("API Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}