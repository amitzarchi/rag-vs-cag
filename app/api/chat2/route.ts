import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages, body } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash-preview-04-17"),
    system: "You are a helpful assistant that can answer questions and help with tasks. The user favorite food is Gefilte fish.",
    messages,
  });
  return result.toDataStreamResponse();
}
