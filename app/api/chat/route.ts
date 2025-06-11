import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages, body } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash-preview-04-17"),
    system: "You are a helpful assistant that can answer questions and help with tasks.",
    messages,
    tools: {
      getUserFavoriteFood: {
        description: "Get the user's favorite food",
        parameters: z.object({
        }),
        execute: async () => {
          return {
            food: "Gefilte fish",
          };
        },
      },
    },
  });
  return result.toDataStreamResponse();
}
