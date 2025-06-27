import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { generateSystemPrompt } from "../utils";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = await generateSystemPrompt();

  const result = streamText({
    model: google("gemini-2.5-flash-preview-04-17"),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
} 