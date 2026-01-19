import { NextRequest, NextResponse } from "next/server";

/**
 * API Route pour la génération d'actions Chief of Staff par IA
 * 
 * POST /api/ai/chief-actions
 * Body: { prompt: string, context: string }
 * Response: { actions: AIGeneratedAction[] }
 */

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured", actions: [] },
        { status: 503 }
      );
    }

    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await request.json();
    const { prompt, context } = body;

    if (!prompt || !context) {
      return NextResponse.json(
        { error: "Missing prompt or context" },
        { status: 400 }
      );
    }

    // Appel à OpenAI pour générer les actions
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: context,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Parser la réponse JSON
    const parsedResponse = JSON.parse(responseContent);

    return NextResponse.json({
      actions: parsedResponse.actions || [],
      usage: completion.usage,
    });
  } catch (error) {
    console.error("Error generating Chief actions:", error);
    return NextResponse.json(
      { error: "Failed to generate actions", details: error, actions: [] },
      { status: 500 }
    );
  }
}
