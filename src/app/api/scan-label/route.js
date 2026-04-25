import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  const { imageBase64, mediaType, language } = await request.json();

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
              media_type: mediaType, // e.g. "image/jpeg"
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: `You are a multilingual nutrition assistant for immigrants. 
            Analyze this food label and explain it in ${language}. 
            Include: what the product is, key nutrients to be aware of, 
            any allergens, and cultural context if relevant 
            (e.g. high sodium for someone from a low-sodium cuisine).
            Keep it simple and friendly.`,
          },
        ],
      },
    ],
  });

  return Response.json({ result: response.content[0].text });
}